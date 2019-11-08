-- TABLES:

create table reviews
(
  id INT PRIMARY KEY,
  product_id INT,
  rating INT,
  submit_date DATETIME,
  summary VARCHAR(1000),
  body VARCHAR(1000),
  recommend INT,
  reported TINYINT,
  reviewer_name VARCHAR(50)
);

create table characteristics
(
  id INT PRIMARY KEY,
  review_id INT,
  name VARCHAR(50)
);

create table characteristic_reviews
(
  id INT PRIMARY KEY,
  chracteristic_id INT,
  value INT,
  review_id INT
);

create table reviews_photos
(
  id INT PRIMARY KEY,
  image_url VARCHAR(50),
  review_id INT
);

-- SAMPLE LOADING DATA
LOAD DATA 
LOCAL
INFILE 
'/Users/harryshapiro/hrnyc/reviews/raw_data/characteristic_reviews.csv' INTO TABLE characteristic_reviews
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\n'
IGNORE 1 LINES;