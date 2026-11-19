CREATE SCHEMA app;
REVOKE ALL ON SCHEMA app FROM PUBLIC;
GRANT USAGE ON SCHEMA app TO kitchenmum_app;

CREATE FUNCTION app.current_user_id()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT NULLIF(current_setting('app.user_id', true), '')
$$;

CREATE TABLE app.profiles (
  user_id text PRIMARY KEY,
  display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 120),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE app.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 240),
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Sonstige',
  image_url text NOT NULL DEFAULT '',
  prep_minutes integer CHECK (prep_minutes IS NULL OR prep_minutes >= 0),
  cook_minutes integer CHECK (cook_minutes IS NULL OR cook_minutes >= 0),
  temperature_c integer CHECK (temperature_c IS NULL OR temperature_c BETWEEN 0 AND 400),
  servings integer CHECK (servings IS NULL OR servings > 0),
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(ingredients) = 'array'),
  steps jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(steps) = 'array'),
  source_url text NOT NULL DEFAULT '',
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX recipes_user_created_idx ON app.recipes (user_id, created_at DESC);
CREATE INDEX recipes_user_favorites_idx ON app.recipes (user_id, created_at DESC) WHERE is_favorite;

CREATE TABLE app.account_preferences (
  user_id text PRIMARY KEY,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(preferences) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE app.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  provider text NOT NULL DEFAULT 'manual',
  external_customer_id text,
  external_subscription_id text,
  plan_key text NOT NULL DEFAULT 'free' CHECK (plan_key IN ('free', 'plus_monthly', 'plus_yearly')),
  status text NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'trialing', 'active', 'past_due', 'cancelled', 'expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  provider_data jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(provider_data) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (current_period_end IS NULL OR current_period_start IS NULL OR current_period_end >= current_period_start)
);

CREATE INDEX subscriptions_user_created_idx ON app.subscriptions (user_id, created_at DESC);
CREATE UNIQUE INDEX subscriptions_one_per_user_idx ON app.subscriptions (user_id);
CREATE UNIQUE INDEX subscriptions_provider_id_idx
  ON app.subscriptions (provider, external_subscription_id)
  WHERE external_subscription_id IS NOT NULL;

CREATE FUNCTION app.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON app.profiles
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER recipes_set_updated_at BEFORE UPDATE ON app.recipes
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER account_preferences_set_updated_at BEFORE UPDATE ON app.account_preferences
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();
CREATE TRIGGER subscriptions_set_updated_at BEFORE UPDATE ON app.subscriptions
  FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

ALTER TABLE app.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE app.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.recipes FORCE ROW LEVEL SECURITY;
ALTER TABLE app.account_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.account_preferences FORCE ROW LEVEL SECURITY;
ALTER TABLE app.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app.subscriptions FORCE ROW LEVEL SECURITY;

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

GRANT SELECT, INSERT, UPDATE, DELETE ON app.profiles TO kitchenmum_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.recipes TO kitchenmum_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.account_preferences TO kitchenmum_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON app.subscriptions TO kitchenmum_app;
