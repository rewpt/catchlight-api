DROP TABLE IF EXISTS conversation_participants CASCADE;

CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  message_waiting BOOLEAN DEFAULT true
);