LOAD DATA  LOCAL INFILE  'products.csv' INTO TABLE products FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  'reviews.csv' INTO TABLE reviews FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  'reviews_photos.csv' INTO TABLE reviews_photos FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  'characteristics.csv' INTO TABLE characteristics FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;
LOAD DATA  LOCAL INFILE  'characteristic_reviews.csv' INTO TABLE characteristic_reviews FIELDS TERMINATED BY ','  LINES TERMINATED BY '\n' IGNORE 1 LINES;