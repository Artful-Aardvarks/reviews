DROP TABLE IF EXISTS `products`;

CREATE TABLE IF NOT EXISTS 
  `products` (
    `id` INTEGER NOT NULL auto_increment , 
    `recommend` INTEGER NOT NULL, 
    `review_count` INTEGER NOT NULL, 
    `rating` INTEGER NOT NULL, 
    `five_star` INTEGER NOT NULL, 
    `four_star` INTEGER NOT NULL, 
    `three_star` INTEGER NOT NULL, 
    `two_star` INTEGER NOT NULL, 
    `one_star` INTEGER NOT NULL, 
    PRIMARY KEY (`id`)
  )
  ENGINE=InnoDB;

SHOW INDEX FROM `products`;

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE IF NOT EXISTS 
  `reviews` (
    `id` INTEGER NOT NULL auto_increment , 
    `product_id` INTEGER, 
    `rating` INTEGER NOT NULL, 
    `created_date` DATETIME NOT NULL, 
    `summary` VARCHAR(1000), 
    `body` VARCHAR(5000), 
    `recommend` TINYINT(1) NOT NULL, 
    `reported` TINYINT(1), 
    `reviewer_name` VARCHAR(255) NOT NULL, 
    `reviewer_email` VARCHAR(255), 
    `response` VARCHAR(5000), 
    `helpfulness` INTEGER NOT NULL DEFAULT 0, 
    PRIMARY KEY (`id`), 
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
  )
  ENGINE=InnoDB;

SHOW INDEX FROM `reviews`;

DROP TABLE IF EXISTS `reviews_photos`;

CREATE TABLE IF NOT EXISTS 
  `reviews_photos` (
    `id` INTEGER NOT NULL auto_increment , 
    `review_id` INTEGER, 
    `image_url` VARCHAR(300) NOT NULL, 
    PRIMARY KEY (`id`), 
    FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
  )
  ENGINE=InnoDB;

SHOW INDEX FROM `reviews_photos`;

DROP TABLE IF EXISTS `characteristics`;

CREATE TABLE IF NOT EXISTS 
  `characteristics` (
    `id` INTEGER NOT NULL auto_increment , 
    `product_id` INTEGER, 
    `name` VARCHAR(255), 
    PRIMARY KEY (`id`), 
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
  )
  ENGINE=InnoDB;

SHOW INDEX FROM `characteristics`;

DROP TABLE IF EXISTS `characteristic_reviews`;

CREATE TABLE IF NOT EXISTS 
  `characteristic_reviews` (
    `id` INTEGER NOT NULL auto_increment , 
    `characteristic_id` INTEGER, 
    `review_id` INTEGER, 
    `value` INTEGER NOT NULL, PRIMARY KEY (`id`), 
    FOREIGN KEY (`characteristic_id`) REFERENCES `characteristics` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE, 
    FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
  )
  ENGINE=InnoDB;

SHOW INDEX FROM `characteristic_reviews`;