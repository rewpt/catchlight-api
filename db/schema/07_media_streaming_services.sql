DROP TABLE IF EXISTS media_streaming_services CASCADE;

CREATE TABLE media_streaming_services (
  id SERIAL PRIMARY KEY,
  media_id INTEGER REFERENCES media(id) ON DELETE CASCADE,
  streaming_service_id INTEGER REFERENCES streaming_services(id) ON DELETE CASCADE
);