INSERT INTO "Recorded_scores" (question_id, user_id, score)
	VALUES
	(19, 'test2', 2),
	(19, 'user1', 4),
	(19, 'user3', 5), -------------
	(21, 'user2', 3),
	(21, 'test1', 4),
	(21, 'user4', 5),
	(21, 'user5', 2),
	(21, 'user1', 5), -------------
	(20, 'user1', 3),
	(20, 'user6', 5),
	(20, 'user3', 5),
	(20, 'user4', 1),
	(20, 'user2', 3), -------------
	(23, 'user5', 1),
	(23, 'test2', 1),
	(23, 'user2', 2),
	(23, 'user6', 3),
	(23, 'user1', 1),
	(23, 'user4', 3), -------------
	(25, 'user6', 4),
	(25, 'user3', 5),
	(25, 'user5', 3), -------------
	(27, 'user2', 5),
	(27, 'test2', 4),
	(27, 'user4', 3),
	(27, 'user1', 2),
	(27, 'user3', 1),
	(27, 'user6', 2),
	(27, 'user5', 3), -------------
	(38, 'test2', 2),
	(38, 'user6', 2), -------------
	(41, 'user3', 3),
	(41, 'user2', 4),
	(41, 'test1', 3),
	(41, 'user1', 4), -------------
	(44, 'user4', 3),
	(44, 'test2', 1),
	(44, 'user6', 5), -------------
	(47, 'user2', 1),
	(47, 'user1', 3),
	(47, 'test1', 2),
	(47, 'test2', 5),
	(47, 'user6', 5), -------------
	(49, 'user3', 1),
	(49, 'test1', 2),
	(49, 'test2', 4),
	(49, 'user5', 4),
	(49, 'user4', 4),
	(49, 'user2', 5), -------------
	(52, 'user6', 3), -------------
	(53, 'test2', 1),
	(53, 'user1', 3), -------------
	(56, 'user5', 3),
	(56, 'test1', 3),
	(56, 'user3', 3);

UPDATE "Question" SET score = 3.66, number_of_voters = 3 WHERE question_id = 19;
UPDATE "Question" SET score = 3.4, number_of_voters = 5 WHERE question_id = 20;
UPDATE "Question" SET score = 3.8, number_of_voters = 5 WHERE question_id = 21;
UPDATE "Question" SET score = 1.83, number_of_voters = 6 WHERE question_id = 23;
UPDATE "Question" SET score = 4, number_of_voters = 3 WHERE question_id = 25;
UPDATE "Question" SET score = 2.85, number_of_voters = 7 WHERE question_id = 27;
UPDATE "Question" SET score = 2, number_of_voters = 2 WHERE question_id = 38;
UPDATE "Question" SET score = 3.5, number_of_voters = 4 WHERE question_id = 41;
UPDATE "Question" SET score = 3, number_of_voters = 3 WHERE question_id = 44;
UPDATE "Question" SET score = 3.2, number_of_voters = 5 WHERE question_id = 47;
UPDATE "Question" SET score = 3.33, number_of_voters = 6 WHERE question_id = 49;
UPDATE "Question" SET score = 3, number_of_voters = 1 WHERE question_id = 52;
UPDATE "Question" SET score = 2, number_of_voters = 2 WHERE question_id = 53;
UPDATE "Question" SET score = 3, number_of_voters = 3 WHERE question_id = 56;
