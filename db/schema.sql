
-- ***** PRODUCT OVERVIEW SCHEMA DESIGN ****

DROP DATABASE IF EXISTS product_overview;

CREATE DATABASE IF NOT EXISTS product_overview;

USE product_overview;


CREATE TABLE IF NOT EXISTS products (
	id int NOT NULL AUTO_INCREMENT,
	product_title varchar(255) NOT NULL,
	vendor_name varchar(50) NOT NULL,
	review_average DECIMAL(2,1), 
	review_count int DEFAULT 0,
	answered_questions int, 
	list_price varchar(15) NOT NULL,
	discount varchar(4),
	price varchar(15) NOT NULL,
	prime tinyint(1) NOT NULL,
	description text,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS photos (
	photo_id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	main_url varchar(255) NOT NULL,
	zoom_url varchar(255) NOT NULL,
	product_id int,
	main_photo tinyint(1) NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(id)
);

-- CREATE TABLE products(
--      id serial PRIMARY KEY,
--  product_title varchar(255) NOT NULL,
--  vendor_name varchar(50) NOT NULL,
--  review_average DECIMAL(2,1), 
--  review_count smallint DEFAULT 0,
--  answered_questions integer, 
--  list_price varchar(15) NOT NULL,
--  discount varchar(4),
--  price varchar(15) NOT NULL,
--  prime smallint NOT NULL,
--  description text
--  );