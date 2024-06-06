/* dummy reviews */
USE bubblemap;
INSERT INTO `review` (`user_id`, `store_id`, `rating`, `review_text`)
VALUES 
  ((SELECT id FROM `user` WHERE username = 'user1'), (SELECT id FROM `store` WHERE name = 'Bubble Time'), 4, 'Great bubble tea!'),
  ((SELECT id FROM `user` WHERE username = 'user1'), (SELECT id FROM `store` WHERE name = 'Mommy Cake Bubbletea'), 3, 'Decent place, good cakes.'),
  ((SELECT id FROM `user` WHERE username = 'user2'), (SELECT id FROM `store` WHERE name = 'Bubble Time'), 5, 'Best bubble tea in town!'),
  ((SELECT id FROM `user` WHERE username = 'user3'), (SELECT id FROM `store` WHERE name = 'Bubble Tea Factory Lisbon'), 4, 'Unique flavors, loved it!'),
  ((SELECT id FROM `user` WHERE username = 'user4'), (SELECT id FROM `store` WHERE name = 'CONBINI'), 2, 'Not impressed, limited selection.');
