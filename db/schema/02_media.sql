DROP TABLE IF EXISTS media;

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image TEXT, 
  imdb_id integer NOT NULL
);