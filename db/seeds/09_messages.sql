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
(9, 2, 'Ok');


INSERT INTO messages (user_id, conversation_id, content, deleted)
VALUES
(4, 3, 'I am writing something I am going to delete', true),
(9, 2, 'I love tacos', true);
