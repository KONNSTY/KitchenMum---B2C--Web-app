from __future__ import annotations

import json
import os
from contextlib import asynccontextmanager
from typing import Any
from uuid import UUID

from fastapi import Depends, FastAPI, Header, HTTPException, Response, status
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "")
DATABASE_URL = os.environ.get("DATABASE_URL", "")
pool: ConnectionPool | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global pool
    if not PROJECT_ID or not DATABASE_URL:
        raise RuntimeError("FIREBASE_PROJECT_ID and DATABASE_URL are required")
    pool = ConnectionPool(DATABASE_URL, min_size=1, max_size=10, kwargs={"row_factory": dict_row}, open=True)
    yield
    pool.close()


app = FastAPI(title="KitchenMum API", version="1.0.0", lifespan=lifespan)


class Principal(BaseModel):
    uid: str
    email: str
    display_name: str


def current_user(authorization: str | None = Header(default=None)) -> Principal:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Anmeldung erforderlich")
    token = authorization.removeprefix("Bearer ").strip()
    if not token or len(token) > 8192:
        raise HTTPException(status_code=401, detail="Ungültiges Token")
    try:
        claims = id_token.verify_firebase_token(token, GoogleRequest(), audience=PROJECT_ID)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Ungültiges oder abgelaufenes Token") from exc
    uid = claims.get("sub")
    email = claims.get("email")
    if not isinstance(uid, str) or not uid or len(uid) > 128 or not isinstance(email, str):
        raise HTTPException(status_code=401, detail="Ungültige Kontoangaben")
    if claims.get("email_verified") is not True:
        raise HTTPException(status_code=403, detail="Bitte bestätige zuerst deine E-Mail-Adresse")
    return Principal(uid=uid, email=email, display_name=str(claims.get("name") or email.split("@")[0])[:120])


def user_connection(principal: Principal = Depends(current_user)):
    if pool is None:
        raise HTTPException(status_code=503, detail="Datenbank nicht verfügbar")
    connection = pool.getconn()
    try:
        with connection.transaction():
            connection.execute("SELECT set_config('app.user_id', %s, true)", (principal.uid,))
            yield connection
    finally:
        pool.putconn(connection)


UserDb = Depends(user_connection)


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    display_name: str = Field(min_length=1, max_length=120)

    @field_validator("display_name")
    @classmethod
    def trim_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name darf nicht leer sein")
        return value


class RecipeInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str = Field(min_length=1, max_length=240)
    description: str = Field(default="", max_length=10000)
    category: str = Field(default="Sonstige", max_length=80)
    image_url: str = Field(default="", max_length=2048)
    prep_minutes: int | None = Field(default=None, ge=0, le=1440)
    cook_minutes: int | None = Field(default=None, ge=0, le=1440)
    temperature_c: int | None = Field(default=None, ge=0, le=400)
    servings: int | None = Field(default=None, ge=1, le=1000)
    ingredients: list[str] = Field(default_factory=list, max_length=250)
    steps: list[str] = Field(default_factory=list, max_length=250)
    source_url: str = Field(default="", max_length=2048)
    is_favorite: bool = False

    @field_validator("title", "category")
    @classmethod
    def strip_required(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Wert darf nicht leer sein")
        return value.strip()


def recipe_json(row: dict[str, Any]) -> dict[str, Any]:
    return {
        "id": str(row["id"]), "title": row["title"], "description": row["description"],
        "category": row["category"], "image": row["image_url"], "prepMinutes": row["prep_minutes"],
        "cookMinutes": row["cook_minutes"], "temperature": row["temperature_c"], "servings": row["servings"],
        "ingredients": row["ingredients"], "steps": row["steps"], "sourceUrl": row["source_url"],
        "favorite": row["is_favorite"], "createdAt": row["created_at"].isoformat(),
    }


@app.get("/health/live")
def live():
    return {"status": "ok"}


@app.get("/health/ready")
def ready():
    if pool is None:
        raise HTTPException(status_code=503, detail="Datenbank nicht verfügbar")
    try:
        with pool.connection() as connection:
            connection.execute("SELECT 1")
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Datenbank nicht verfügbar") from exc
    return {"status": "ok"}


@app.get("/api/v1/profile")
def get_profile(user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("SELECT user_id, display_name, created_at, updated_at FROM app.profiles WHERE user_id = %s", (user.uid,)).fetchone()
    if row is None:
        row = connection.execute("INSERT INTO app.profiles(user_id, display_name) VALUES (%s, %s) RETURNING user_id, display_name, created_at, updated_at", (user.uid, user.display_name)).fetchone()
        connection.execute("INSERT INTO app.subscriptions(user_id) VALUES (%s) ON CONFLICT DO NOTHING", (user.uid,))
    return {"userId": row["user_id"], "name": row["display_name"], "email": user.email, "createdAt": row["created_at"].isoformat(), "updatedAt": row["updated_at"].isoformat()}


@app.put("/api/v1/profile")
def update_profile(body: ProfileUpdate, user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("INSERT INTO app.profiles(user_id, display_name) VALUES (%s, %s) ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name RETURNING user_id, display_name, created_at, updated_at", (user.uid, body.display_name)).fetchone()
    connection.execute("INSERT INTO app.subscriptions(user_id) VALUES (%s) ON CONFLICT DO NOTHING", (user.uid,))
    return {"userId": row["user_id"], "name": row["display_name"], "email": user.email, "createdAt": row["created_at"].isoformat(), "updatedAt": row["updated_at"].isoformat()}


@app.get("/api/v1/recipes")
def list_recipes(user: Principal = Depends(current_user), connection=Depends(user_connection)):
    rows = connection.execute("SELECT * FROM app.recipes ORDER BY created_at DESC LIMIT 500", ()).fetchall()
    return [recipe_json(row) for row in rows]


@app.post("/api/v1/recipes", status_code=201)
def create_recipe(body: RecipeInput, user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("INSERT INTO app.recipes(user_id,title,description,category,image_url,prep_minutes,cook_minutes,temperature_c,servings,ingredients,steps,source_url,is_favorite) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s::jsonb,%s::jsonb,%s,%s) RETURNING *", (user.uid, body.title, body.description, body.category, body.image_url, body.prep_minutes, body.cook_minutes, body.temperature_c, body.servings, json.dumps(body.ingredients), json.dumps(body.steps), body.source_url, body.is_favorite)).fetchone()
    return recipe_json(row)


@app.get("/api/v1/recipes/{recipe_id}")
def get_recipe(recipe_id: UUID, user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("SELECT * FROM app.recipes WHERE id = %s", (recipe_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return recipe_json(row)


@app.put("/api/v1/recipes/{recipe_id}")
def update_recipe(recipe_id: UUID, body: RecipeInput, user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("UPDATE app.recipes SET title=%s,description=%s,category=%s,image_url=%s,prep_minutes=%s,cook_minutes=%s,temperature_c=%s,servings=%s,ingredients=%s::jsonb,steps=%s::jsonb,source_url=%s,is_favorite=%s WHERE id=%s RETURNING *", (body.title, body.description, body.category, body.image_url, body.prep_minutes, body.cook_minutes, body.temperature_c, body.servings, json.dumps(body.ingredients), json.dumps(body.steps), body.source_url, body.is_favorite, recipe_id)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return recipe_json(row)


@app.delete("/api/v1/recipes/{recipe_id}", status_code=204)
def delete_recipe(recipe_id: UUID, user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("DELETE FROM app.recipes WHERE id = %s RETURNING id", (recipe_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.patch("/api/v1/recipes/{recipe_id}/favorite")
def toggle_favorite(recipe_id: UUID, user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("UPDATE app.recipes SET is_favorite = NOT is_favorite WHERE id = %s RETURNING *", (recipe_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Rezept nicht gefunden")
    return recipe_json(row)


@app.get("/api/v1/preferences")
def get_preferences(user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("SELECT preferences FROM app.account_preferences WHERE user_id = %s", (user.uid,)).fetchone()
    return row["preferences"] if row else {}


@app.put("/api/v1/preferences")
def put_preferences(preferences: dict[str, Any], user: Principal = Depends(current_user), connection=Depends(user_connection)):
    if len(json.dumps(preferences)) > 20000:
        raise HTTPException(status_code=413, detail="Einstellungen sind zu umfangreich")
    row = connection.execute("INSERT INTO app.account_preferences(user_id, preferences) VALUES (%s, %s::jsonb) ON CONFLICT (user_id) DO UPDATE SET preferences = EXCLUDED.preferences RETURNING preferences", (user.uid, json.dumps(preferences))).fetchone()
    return row["preferences"]


@app.get("/api/v1/subscription")
def get_subscription(user: Principal = Depends(current_user), connection=Depends(user_connection)):
    row = connection.execute("SELECT plan_key, status, current_period_start, current_period_end, cancel_at_period_end FROM app.subscriptions WHERE user_id = %s ORDER BY created_at DESC LIMIT 1", (user.uid,)).fetchone()
    if row is None:
        connection.execute("INSERT INTO app.subscriptions(user_id) VALUES (%s)", (user.uid,))
        return {"plan": "free", "status": "free", "currentPeriodStart": None, "currentPeriodEnd": None, "cancelAtPeriodEnd": False}
    return {"plan": row["plan_key"], "status": row["status"], "currentPeriodStart": row["current_period_start"].isoformat() if row["current_period_start"] else None, "currentPeriodEnd": row["current_period_end"].isoformat() if row["current_period_end"] else None, "cancelAtPeriodEnd": row["cancel_at_period_end"]}


@app.delete("/api/v1/account", status_code=204)
def delete_account_data(user: Principal = Depends(current_user), connection=Depends(user_connection)):
    connection.execute("DELETE FROM app.recipes")
    connection.execute("DELETE FROM app.account_preferences")
    connection.execute("DELETE FROM app.subscriptions")
    connection.execute("DELETE FROM app.profiles")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
