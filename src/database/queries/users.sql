/* Create dummy users */
USE bubblemap;
INSERT INTO user (username, email, password, admin)
VALUES 
  ('admin', 'admin@test.com', '$2a$10$W2ljcBXhDM7/sqISD/N9Cu9Vd0HYpZBs53qE5jPbqlURx5ZXmnOB2', true),
  ('user1', 'user1@test.com', '$2a$10$jFOUYbZYe75R8qCr8UIGr.XIdJjnUBKyo0IYFc4clj9hVZaRy23bm', false),
  ('user2', 'user2@test.com', '$2a$10$R4c.fHZ.rdZY1sqUFiK30eyAGJYVB8f2zRA7hX/cOBLVJQj1JpGlu', false),
  ('user3', 'user3@test.com', '$2a$10$iIxdfsexIUExCVTHb7aiGOSTX00dPCYzb1EnjZ0o1XkO9Qy6O0B4a', false),
  ('user4', 'user4@test.com', '$2a$10$KSJU48UAIXO5aBe9ZlXj4uuH098MuMg6Ofp66yHaUmUJoHeCCId42', false);

/* 
 this is unsafe, only use for testing ...
 admin: unsafe_password_admin
 user1: unsafe_user_password1 */
