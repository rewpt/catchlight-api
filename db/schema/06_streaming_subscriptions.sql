DROP TABLE IF EXISTS streaming_subscriptions CASCADE;

CREATE TABLE streaming_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  streaming_service_id INTEGER REFERENCES streaming_services(id) ON DELETE CASCADE
);