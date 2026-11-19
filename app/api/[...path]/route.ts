import { NextRequest, NextResponse } from "next/server";

const allowedMethods = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);
const allowedRoutes = [/^profile$/, /^recipes$/, /^recipes\/[0-9a-f-]{36}$/, /^recipes\/[0-9a-f-]{36}\/favorite$/, /^preferences$/, /^subscription$/, /^account$/];

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  if (!allowedMethods.has(request.method) || path.length < 1 || path[0] !== "v1") {
    return NextResponse.json({ detail: "Nicht gefunden" }, { status: 404 });
  }
  const apiPath = path.slice(1).join("/");
  if (!allowedRoutes.some((pattern) => pattern.test(apiPath))) {
    return NextResponse.json({ detail: "Nicht gefunden" }, { status: 404 });
  }
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ detail: "Anmeldung erforderlich" }, { status: 401 });
  }
  const baseUrl = process.env.KITCHENMUM_API_URL;
  if (!baseUrl) return NextResponse.json({ detail: "API ist nicht konfiguriert" }, { status: 503 });
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  if (body && body.length > 1_000_000) return NextResponse.json({ detail: "Anfrage ist zu groß" }, { status: 413 });
  try {
    const upstream = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/${apiPath}`, {
      method: request.method,
      headers: {
        Authorization: authorization,
        ...(request.headers.get("content-type") ? { "Content-Type": request.headers.get("content-type")! } : {}),
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (upstream.status === 204) return new NextResponse(null, { status: 204 });
    const contentType = upstream.headers.get("content-type") || "application/json";
    return new NextResponse(await upstream.text(), { status: upstream.status, headers: { "Content-Type": contentType, "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ detail: "KitchenMum-API ist nicht erreichbar" }, { status: 502 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
