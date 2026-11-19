BEGIN;

DROP POLICY IF EXISTS profiles_owner ON app.profiles;
DROP POLICY IF EXISTS recipes_owner ON app.recipes;
DROP POLICY IF EXISTS preferences_owner ON app.account_preferences;
DROP POLICY IF EXISTS subscriptions_owner ON app.subscriptions;

DROP FUNCTION app.current_user_id();

ALTER TABLE app.profiles
  ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE app.recipes
  ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE app.account_preferences
  ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE app.subscriptions
  ALTER COLUMN user_id TYPE text USING user_id::text;

CREATE FUNCTION app.current_user_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '')
$$;

CREATE POLICY profiles_owner ON app.profiles
  USING (user_id = app.current_user_id())
  WITH CHECK (user_id = app.current_user_id());
CREATE POLICY recipes_owner ON app.recipes
  USING (user_id = app.current_user_id())
  WITH CHECK (user_id = app.current_user_id());
CREATE POLICY preferences_owner ON app.account_preferences
  USING (user_id = app.current_user_id())
  WITH CHECK (user_id = app.current_user_id());
CREATE POLICY subscriptions_owner ON app.subscriptions
  USING (user_id = app.current_user_id())
  WITH CHECK (user_id = app.current_user_id());

COMMIT;
