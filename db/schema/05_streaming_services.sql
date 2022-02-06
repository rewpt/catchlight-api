DROP TABLE IF EXISTS streaming_services CASCADE;

CREATE TABLE streaming_services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE
);