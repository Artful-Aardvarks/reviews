LOAD DATA  LOCAL INFILE  '/Users/harryshapiro/hrnyc/reviews/clean_data/products.csv' INTO TABLE products FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  '/Users/harryshapiro/hrnyc/reviews/clean_data/reviews.csv' INTO TABLE reviews FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  '/Users/harryshapiro/hrnyc/reviews/clean_data/reviews_photos.csv' INTO TABLE reviews_photos FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  '/Users/harryshapiro/hrnyc/reviews/clean_data/characteristics.csv' INTO TABLE characteristics FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  '/Users/harryshapiro/hrnyc/reviews/clean_data/characteristic_reviews.csv' INTO TABLE characteristic_reviews FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;

LOAD DATA  LOCAL INFILE  '/home/ubuntu/clean_data/products.csv' INTO TABLE products FIELDS 