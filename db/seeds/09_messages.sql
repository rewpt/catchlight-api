INSERT INTO messages (user_id, conversation_id, content)
VALUES 
(1, 3, 'hey what''s up'),
(2, 3, 'not much, you?'),
(1, 3, 'something something climate change'),
(2, 3, 'cool'),
(9, 2, 'What a great movie!!'),
(8, 2, 'Yeah it was great!'),
(9, 2, 'Could have used more Bradley Cooper'),
(8, 2, 'Nah, he is terrible'),
(9, 2, 'Ok'),
(2, 11, 'message1'),
(6, 11, 'message2'),
(2, 12, 'A message about Lost in Translation'),
(6, 12, 'A reply about lost in translation'),
(2, 13, 'Talking about resevoir dogs'),
(4, 13, 'Yeah gr8 movie'),
(2, 8, 'when harry met sally comment'),
(6, 8, 'when harry met sally reply');


INSERT INTO messages (user_id, conversation_id, content, deleted)
VALUES
(4, 3, 'I am writing something I am going to delete', true),
(9, 2, 'I love tacos', true);
