INSERT INTO interactions (user_id, media_id, watch_list, rating) 
VALUES 
(1, 1, true, 'like'),
(1, 9, true, 'dislike'),
(1, 3, true, 'like'),
(2, 2, true, 'like'),
(3, 1, true, 'meh'),
(3, 1, true, 'dislike'),
(4, 5, true, 'meh'),
(4, 7, true, 'like'),
(4, 9, true, 'dislike'),
(5, 1, true, 'dislike'),
(5, 8, true, 'like'),
(5, 2, true, 'meh'),
(6, 7, true, 'like'),
(7, 7, true, 'meh'),
(8, 8, true, 'dislike'),
(9, 1, true, 'like'),
(10, 1, true, 'dislike');

INSERT INTO interactions (user_id, media_id, watched) VALUES (2, 1, false);
