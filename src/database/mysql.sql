/* Create db and tables */
CREATE DATABASE `bubblemap`;

USE `bubblemap`;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) UNIQUE NOT NULL,
  `email` varchar(100) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` boolean DEFAULT false,
  `created_at` timestamp DEFAULT (current_timestamp())
);

CREATE TABLE `stores` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(70),
  `description` varchar(255),
  `photo` json,
  `adress` varchar(100),
  `latitude` decimal(8,6),
  `longitude` decimal(9,6),
  `created_at` timestamp DEFAULT (current_timestamp())
);

CREATE TABLE `reviews` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `rating` int NOT NULL,
  `review_text` text NOT NULL,
  `created_at` timestamp DEFAULT (current_timestamp())
);

CREATE TABLE `review_filters` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `filter_id` int NOT NULL
);

CREATE TABLE `filters` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(50) UNIQUE NOT NULL
);

ALTER TABLE `reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

ALTER TABLE `review_filters` ADD FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`);

ALTER TABLE `review_filters` ADD FOREIGN KEY (`filter_id`) REFERENCES `filters` (`id`);
