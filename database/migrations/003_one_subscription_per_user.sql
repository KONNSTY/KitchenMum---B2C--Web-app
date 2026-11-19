CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_one_per_user_idx ON app.subscriptions (user_id);
