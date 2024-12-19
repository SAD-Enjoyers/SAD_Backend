/* Database schema for SAD_Enjoyers (project)
 *
 *	Create Tables structures and Views
 *
 */
-------------------------------------- Users --------------------------------------

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

-------------------------------------- Common --------------------------------------

-- All categories
CREATE TABLE "Category" (
	category_id smallserial NOT NULL PRIMARY KEY,
	category varchar(30) NOT NULL UNIQUE
);

-------------------------------------- Services --------------------------------------

-- All Educational Service Information
CREATE TABLE "Educational_service" (
	user_id varchar(30) NOT NULL,
	service_id serial UNIQUE,const { Exam, EducationalService, ExamAnswers, Registers, SelectedQuestions, } = require('../../models');
const { success, error, convPreviewExam, convExam } = require('../../utils');
const { Op } = require('sequelize');
const { sequelize, logger } = require('../../configs');

	s_name varchar(150) NOT NULL,
	description text,
	s_level char(1) NOT NULL, 					-- 1: Beginner, 2: Medium, 3: Advanced
	price numeric(6, 2) DEFAULT 0.0,
	service_type char(1) NOT NULL, 				-- 1: Exam, 2: Article, 3: Video
	activity_status char(1) DEFAULT 'P',		-- A: Active, S: suspended, P: passive
	score NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
	number_of_voters smallint NOT NULL DEFAULT 0, 
	image varchar(250),
	tag1 varchar(30),
	tag2 varchar(30),
	tag3 varchar(30),
	PRIMARY KEY (service_id, user_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE
);


-- All Service Scores recorded
CREATE TABLE "Service_recorded_scores" (
	service_id INTEGER NOT NULL,
	user_id varchar(30) NOT NULL,
	score NUMERIC(3, 2) NOT NULL,
	PRIMARY KEY (service_id, user_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Register On Services
CREATE TABLE "Registers" (
	user_id varchar(30) NOT NULL,
	service_id INTEGER NOT NULL,
	PRIMARY KEY (user_id, service_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Services comments
CREATE TABLE "Comment" (
	comment_id BIGSERIAL UNIQUE,
	parent_comment BIGINT,
	service_id INTEGER NOT NULL,
	user_id varchar(30) NOT NULL,
	c_text TEXT NOT NULL,
	c_date TIMESTAMP NOT NULL,
	PRIMARY KEY (comment_id, service_id, user_id),
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (parent_comment) REFERENCES "Comment"(comment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-------------------------------------- Exam --------------------------------------

-- Exam Information
CREATE TABLE "Exam" (
	service_id integer UNIQUE,
	exam_duration integer NOT NULL,
	min_pass_score integer NOT NULL,
	PRIMARY KEY (service_id),
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- All Questions inforamtion
CREATE TABLE "Question" (
	user_id varchar(30) NOT NULL,
	question_id serial NOT NULL UNIQUE,
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
	tag1 varchar(30),
	tag2 varchar(30),
	tag3 varchar(30),
	PRIMARY KEY (question_id, user_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE -- it may challenge data integrity by delete account and create new account 
);

-- All Question Scores recorded
CREATE TABLE "Recorded_scores" (
	question_id INTEGER NOT NULL,
	user_id varchar(30) NOT NULL,
	score NUMERIC(3, 2) NOT NULL,
	PRIMARY KEY (question_id, user_id),
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	FOREIGN KEY (question_id) REFERENCES "Question"(question_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Selected question for exam
CREATE TABLE "Selected_question" (
	service_id INTEGER NOT NULL,
	question_id INTEGER NOT NULL,
	sort_number SMALLINT,
	PRIMARY KEY (service_id, question_id),
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (question_id) REFERENCES "Question"(question_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- User result from exam
CREATE TABLE "Exam_result"(
	service_id INTEGER NOT NULL,
	user_id varchar(30) NOT NULL,
	participation_times SMALLINT NOT NULL,
	start_time timestamp,
	exam_score SMALLINT,
	passed char(1),
	right_answers SMALLINT,
	wrong_answers SMALLINT,
	empty_answers SMALLINT,
	PRIMARY KEY (service_id, user_id),
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Exam_answers" (
	service_id INTEGER NOT NULL,
	user_id varchar(30) NOT NULL,
	question_id INTEGER NOT NULL,
	user_answer SMALLINT,
	right_answer SMALLINT,
	PRIMARY KEY (question_id, service_id, user_id),
	FOREIGN KEY (question_id) REFERENCES "Question"(question_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	FOREIGN KEY (user_id) REFERENCES "User"(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-------------------------------------- Article --------------------------------------

CREATE TABLE "Article" (
	service_id integer UNIQUE,
	title varchar(255) NOT NULL,
	a_text text NOT NULL,
	attachment varchar(255),
	PRIMARY KEY (service_id),
	FOREIGN KEY (service_id) REFERENCES "Educational_service"(service_id) ON DELETE CASCADE ON UPDATE CASCADE
);
