INSERT INTO "User" (
	user_id, email, u_password, first_name, last_name, sex, address, birth_date, description, phone_number, image, balance, card_number, verified, verification_token
) VALUES
('test1', 'test1@gmail.com', '$2b$09$b4ALwjiVzmpoOUUHvbil..9OrI1sLrWBixkErJbstilQ.hG2ZZYia', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, NULL),
('test2', 'test2@gmail.com', '$2b$09$Jm7Yqtt.lbkd//0bB7rCXOOjjogGl2ggv.qWbf.jJizTN4q4y5zWe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, TRUE, NULL),
('user1', 'john.doe@example.com', '$2b$09$MRqGiZ/6PRdstzLp9Zoq5erwoaxhm8RLWebrdim/gMzmHpHCv7AZC', 'John', 'Doe', TRUE, '123 Main St, New York, NY', '1990-01-01', 'A tech enthusiast', '1234567890', 'user1.jpeg', 1500.00, '1234567812345678', TRUE, NULL),
('user2', 'jane.smith@example.com', '$2b$09$ZKJCFarexwpoUvdEASwZzuaTpo3MRQ3E.ykaDSeap7.zVA2Gy9gL.', 'Jane', 'Smith', NULL, NULL, '1992-05-12', NULL, '9876543210', 'user2.jpeg', 2300.50, '8765432187454381', TRUE, NULL),
('user3', 'michael.brown@example.com', '$2b$09$N17w9RB1lP89nODszk3Ojus7R/ZgbFW3wyHscEoe0/mKmeOpU2GvO', 'Michael', 'Brown', TRUE, '789 Oak St, Chicago, IL', NULL, 'A seasoned software engineer', NULL, 'user3.png', 500.75, '4321876543218765', TRUE, NULL),
('user4', 'susan.wilson@example.com', '$2b$09$zwuKHnSy2WgItsXObwXrB.VXPFbsDYOtQJY/PNvOrTu5F4VzrOqVi', 'Susan', 'Wilson', FALSE, NULL, '1995-03-15', 'Enjoys robotics and AI research', NULL, NULL, 100.00, '5678123456781234', TRUE, NULL),
('user5', 'david.jones@example.com', '$2b$09$66ToYeHM12/EGnffhBEoo.cTS4fUPgmGn1II2vf6SLneEVoC4qFWy', 'David', 'Jones', NULL, '654 Cedar St, Phoenix, AZ', NULL, NULL, NULL, NULL, 750.25, '8765432187654321', TRUE, NULL),
('user6', 'emma.white@example.com', '$2b$09$c01HI.NX5HIU/CbLraCLtOm65fxTCzkW7iCoekCRfSlZYv72BPnba', 'Emma', 'White', FALSE, '987 Maple St, San Francisco, CA', NULL, 'Database administrator', '3213213210', NULL, 0.00, NULL, TRUE, NULL),
('user7', 'oliver.miller@example.com', '$2b$09$PqUdyicvolfLCRUrKj/rieN767UAgVb/JXqoNNxtHKJBKgpHAtehW', 'Oliver', 'Miller', TRUE, NULL, '1997-06-10', NULL, '6546546543', NULL, 1200.00, '1234123412341234', FALSE, NULL);


INSERT INTO "Backup_user" (user_id, u_password, recovery_code, generated_time) VALUES 
	('test1', 'testro', NULL, NULL),
	('test2', 'testro', NULL, NULL),
	('user1', 'password_1', NULL, NULL),
	('user2', 'password_2', NULL, NULL),
	('user3', 'password_3', NULL, NULL),
	('user4', 'password_4', NULL, NULL),
	('user5', 'password_5', NULL, NULL),
	('user6', 'password_6', NULL, NULL),
	('user7', 'password_7', NULL, NULL);
