/* Database schema for SAD_Enjoyers (project)
 *
 *	Create Tables structures and Views
 *
 */

-- User Account Information
CREATE TABLE IF NOT EXISTS "User" (
	user_id varchar(30) NOT NULL PRIMARY KEY,
	email varchar(150) NOT NULL UNIQUE,
	u_password varchar(100) NOT NULL,		-- hashed password
	first_name varchar(100),
	last_name varchar(100),
	sex boolean,							-- true: men, false: women
	address text,
	birth_date date,
	description text,
	phone_number varchar(14),
	image varchar(250),
	balance numeric(12, 2),
	card_number char(16),
	verified boolean NOT NULL DEFAULT FALSE,
	verification_token text
);
-- its good to have Exp time for token

-- Backup User Information (also use for statistics)
CREATE TABLE IF NOT EXISTS "Backup_user" (
	user_id varchar(30) NOT NULL,
	u_password varchar(100) NOT NULL, -- plain password
	recovery_code varchar(100),
	generated_time bigint, -- unix timestamp
	PRIMARY KEY (user_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Expert Account Information
CREATE TABLE IF NOT EXISTS "Expert" (
	expert_id varchar(30) NOT NULL,
	e_password varchar(100) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	phone_number varchar(14) NOT NULL,
	organizational_position char(1) DEFAULT 'S', -- E: Educational, S: support, M: manager
	PRIMARY KEY (expert_id)
);


-- All Educational Service Information
CREATE TABLE "Educational_service" (
	user_id varchar(30) NOT NULL,
	service_id varchar(20) NOT NULL,		-- hash of user_id + e_name + service_type
	s_name varchar(70) NOT NULL,
	description text,
	s_level varchar(15) DEFAULT 'Beginner',	-- Beginner, Medium, Advanced
	price numeric(10, 2) NOT NULL,
	service_type smallint NOT NULL,		-- 1: video, 2: article, 3: test
	activity_status char(1) DEFAULT 'P',	-- A: Active, S: suspended, P: passive
	achieved_score float DEFAULT 0,		-- mean of user scores
	achieved_from integer DEFAULT 0,		-- number of attended user
	image varchar(250),
	PRIMARY KEY (service_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Register On Services
CREATE TABLE "Registers" (
	user_id varchar(30) NOT NULL,
	service_id char(20) NOT NULL,
	PRIMARY KEY (user_id, service_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- All categories
CREATE TABLE "Category" (
	category_id smallserial NOT NULL PRIMARY KEY,
	category varchar(30) NOT NULL UNIQUE
);


-- All Questions inforamtion
CREATE TABLE "Question" (
	user_id varchar(30) NOT NULL,
	question_id serial NOT NULL,
	question_name varchar(50) NOT NULL,
	question_text text NOT NULL,
	o1 text NOT NULL, 
	o2 text NOT NULL,
	o3 text NOT NULL,
	o4 text NOT NULL,
	right_answer smallint NOT NULL,
	score NUMERIC(3, 2) DEFAULT 0.00,
	number_of_voters smallint NOT NULL DEFAULT 0, 
	visibility boolean NOT NULL DEFAULT true,
	tag1 smallint,
	tag2 smallint,
	tag3 smallint,
	PRIMARY KEY (question_id, user_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE, -- it may challenge data integrity by delete account and create new account 
	FOREIGN KEY (tag1) REFERENCES "Category"(category_id) ON DELETE set null ON UPDATE CASCADE,
	FOREIGN KEY (tag2) REFERENCES "Category"(category_id) ON DELETE set null ON UPDATE CASCADE,
	FOREIGN KEY (tag3) REFERENCES "Category"(category_id) ON DELETE set null ON UPDATE CASCADE
);
