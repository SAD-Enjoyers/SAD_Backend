const { Exam, EducationalService, ServiceRecordedScores, ExamAnswers,
	Registers, SelectedQuestions, Question, ExamResult } = require('../models');
const { success, error, convPreviewExam, convPrivateExam, convExamQuestions } = require('../utils');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const { sequelize, logger } = require('../configs');

const JWT_SECRET = process.env.JWT_SECRET;

async function makeExam(req, res) {
	req.body.serviceType = '1';
	if (req.body.level == 'Beginner') req.body.level = '1';
	else if (req.body.level == 'Medium') req.body.level = '2';
	else if (req.body.level == 'Advanced') req.body.level = '3';
	else return res.status(400).json(error('Level is not valid.', 400 ));
	
	if (req.body.activityStatus){
		if (req.body.activityStatus == 'Passive')
			req.body.activityStatus = 'P';
		else if (req.body.activityStatus == 'Active')
			req.body.activityStatus = 'A';
		else if (req.body.activityStatus == 'Suspended')
			return res.status(403).json(error('Permission denied.', 403));
		else
			return res.status(400).json(error('Activity state is not valid.', 400));
	}

	if (req.body.examDuration < 1)
		return res.status(400).json(error('Exam duration is not valid.', 400));

	if (req.body.minPassScore > 100 && req.body.minPassScore < 0)
		return res.status(400).json(error('Minimum grade needed to pass exam is not valid.', 400));

	const transaction = await sequelize.transaction();
	try {
		const newService = await EducationalService.create({ user_id: req.userName,
			s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
			price: req.body.price, service_type: req.body.serviceType, 
			activity_status: req.body.activityStatus, image: req.body.image, tag1: req.body.tag1, 
			tag2: req.body.tag2, tag3: req.body.tag3}, { transaction } );
		const newExam = await Exam.create({ service_id: newService.service_id, 
			exam_duration: req.body.examDuration, 
			min_pass_score: req.body.minPassScore}, { transaction })

		await transaction.commit();

		res.status(201).json(success('Exam created successfully.', { serviceId: newService.service_id }));
	} catch (err) {
		await transaction.rollback();

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error creating exam or service.', 500));
	}
}

async function preview(req, res) {
	req.query.serviceId = parseInt(req.query.serviceId);
	let service = await EducationalService.findOne({ where: { service_id: req.query.serviceId } });
	if (!service || (! service.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));

	const exam = await Exam.findOne({ where: { service_id: req.query.serviceId } });
	const userCount = await Registers.count({ where: { service_id: req.query.serviceId }, });
	const questionCount = await SelectedQuestions.count({ where: { service_id: req.query.serviceId } });

	service = convPreviewExam({ ...service.dataValues, ...exam.dataValues, userCount, questionCount });

	let privatePage = false;
	if (req.userName){
		const registered = await Registers.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName } });
		if (req.userName == service.user_id || registered)
			privatePage = true;
	}

	// no need for flag
	res.status(200).json(success('Exam', { Exam: service, privatePage }));
}

async function editExam (req, res) {
	if (req.body.activityStatus){
		if (req.body.activityStatus == 'Passive')
			req.body.activityStatus = 'P';
		else if (req.body.activityStatus == 'Active')
			req.body.activityStatus = 'A';
		else 
			return res.status(403).json(error('Permission denied.', 403));
	}

	if(req.body.level){
		if (req.body.level == 'Beginner') req.body.level = '1';
		else if (req.body.level == 'Medium') req.body.level = '2';
		else if (req.body.level == 'Advanced') req.body.level = '3';
		else return res.status(400).json(error('Level is not valid.', 400 ));
	}

	if (!req.body.serviceId)
		return res.status(400).json(error('Misssing serviceId.', 400));

	let service = await EducationalService.findOne( 
		{ where: { service_id: req.body.serviceId, user_id: req.userName } });
	if(!service)
		return res.status(404).json(error('Exam not found.', 404));
	let exam = await Exam.findOne({ where: { service_id: req.body.serviceId } });

	const transaction = await sequelize.transaction();
	try{
		await service.update({
			s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
			price: req.body.price, activity_status: req.body.activityStatus, 
			image: req.body.image, tag1: req.body.tag1, tag2: req.body.tag2, tag3: req.body.tag3
		}, { transaction })
		await exam.update({ exam_duration: req.body.examDuration, min_pass_score: req.body.minPassScore}, { transaction });
		await transaction.commit();

		res.status(201).json(success('Exam edited successfully.', { serviceId: service.service_id })); 
	} catch (err) {
		await transaction.rollback();

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error editing exam information.', 500));
	}
}

async function privateExam(req, res, service, serviceId) {
	const exam = await Exam.findOne({ where: { service_id: serviceId } });
	const userCount = await Registers.count({ where: { service_id: serviceId } });
	const questionCount = await SelectedQuestions.count({ where: { service_id: serviceId } });

	service = convPrivateExam({ ...service.dataValues, ...exam.dataValues, userCount, questionCount });

	return res.status(200).json(success('private', service));
}

async function publicExam(req, res, service, serviceId) {
}

async function examPage(req, res) {
	const { serviceId } = req.params;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });
	let users = await Registers.findOne({ where: { service_id: serviceId, user_id: req.userName } });
	if (service.service_type == '1'){
		if (req.userName == service.user_id)
			privateExam(req, res, service, serviceId);
		else if (users)
			publicExam(req, res, service, serviceId);
		else
			return res.status(403).json(error('Permission denied.', 403));
	} else
		return res.status(303).json(error('See other services.', 303));
}

async function privateQuestions(req, res) {
	const { serviceId } = req.params;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });	

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	const selectedQuestions = await SelectedQuestions.findAll({ where: { service_id: serviceId },
		include: [
			{
				model: Question,
				attributes: [
					'question_id', 'question_name', 'question_text', 'o1', 'o2', 'o3', 'o4',
					'right_answer', 'score', 'number_of_voters', 'visibility',
					'tag1', 'tag2', 'tag3', 'user_id',
				],
			},
		],
		order: [['sort_number', 'ASC']],
	});

	selectedQuestions.map((item) => ({
		sortNumber: item.sort_number,
		...item.Question.toJSON(),
	}));

	return res.status(200).json(success('questions', selectedQuestions));
}

async function addQuestion(req, res) {
	const { serviceId, questionId } = req.body;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });	

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	let question = await Question.findOne({ where: { question_id: req.body.questionId } });

	if (question.user_id != req.userName && !question.visibility)
		return res.status(403).json(error('Question cannot be select.', 403));

	const isThere = await SelectedQuestions.findOne({ where: 
		{ service_id: serviceId, question_id: questionId } });

	if (isThere)
		return res.status(400).json(error('The question has already been selected.', 400));

	const questionCount = await SelectedQuestions.count({ where: { service_id: serviceId } });
	const newquestion = await SelectedQuestions.create(
		{ service_id: serviceId, question_id: questionId, sort_number: questionCount+1 });

	res.status(201).json(success('Question added.', { serviceId: newquestion.service_id, 
		questionId: newquestion.question_id, sortNumber: newquestion.sort_number}));
}

async function deleteQuestion(req, res) {
	const { serviceId, questionId, sortNumber } = req.body;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	const transaction = await sequelize.transaction();
	try{
		const deleted = await SelectedQuestions.destroy({
			where: { service_id: serviceId, question_id: questionId, sort_number: sortNumber },
		}, { transaction });

		if (!deleted){
			await transaction.commit();
			return res.status(404).json(error('Question not found in the selected list.', 404));
		}

		await SelectedQuestions.update(
			{ sort_number: sequelize.literal('sort_number - 1') },
			{
				where: {
					service_id: serviceId,
					sort_number: { [Op.gt]: sortNumber },
				},
			},
		{ transaction }); // should move transaction to where?
		await transaction.commit();

		res.status(200).json(success('Question deleted and sort numbers updated successfully.', 200));
	} catch (err) {
		await transaction.rollback(); // have bugs deleted question not backed. 

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error deleting question.', 500));
	}
}

async function reorderQuestions(req, res) {
	const { serviceId, reorderedQuestions } = req.body;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });	

	if (service.service_type != '1')
		return res.status(303).json(error('See other services.', 303));

	if (service.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	const currentQuestions = await SelectedQuestions.findAll({
		where: { service_id: serviceId }
	});

	// if check for also new sort number is good
	const currentQuestionIds = currentQuestions.map((q) => q.question_id);
	const inputQuestionIds = reorderedQuestions.map((q) => q.questionId);
	if (
		currentQuestionIds.length !== inputQuestionIds.length || // Check for missing/extra questions
		!currentQuestionIds.every((id) => inputQuestionIds.includes(id)) // Check for mismatched IDs
	)
		return res.status(400).json(error('The provided questions do not match the selected questions for the course.', 400));

	const transaction = await SelectedQuestions.sequelize.transaction();
	try {
		await Promise.all(
			reorderedQuestions.map((q) =>
				SelectedQuestions.update(
					{ sort_number: q.sortNumber },
					{
						where: { service_id: serviceId, question_id: q.questionId },
						transaction,
					}
				)
			)
		);
		await transaction.commit();
		res.status(204).json(success('Selected questions reordered successfully.'));

	} catch (err) {
		await transaction.rollback();
		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Failed to reorder selected questions.', 500));
	}
}

async function exams(req, res) {
	const { search, tags, sort, level } = req.query;

	let s_level = '1';
	if(level){
		if (level == 'Beginner') s_level = '1';
		else if (level == 'Medium') s_level = '2';
		else if (level == 'Advanced') s_level = '3';
		else return res.status(400).json(error('Level is not valid.', 400 ));
	} else 
		s_level = [ '1', '2', '3' ];

	let filters = {};
	if(req.partialAccess){
		filters = {
			[Op.or]: [
				{ activity_status: 'A' },
			], [Op.and]: [
				{ service_type: '1', s_level: s_level },
			],
		};
	} else {
		filters = {
			[Op.or]: [
				{ activity_status: 'A' },
				{ user_id: req.userName },
			], [Op.and]: [
				{ service_type: '1', s_level: s_level },
			],
		};
	}

	if (search) {
		filters.s_name = {
			[Op.iLike]: `%${search}%`,
		};
	}

	if (tags) {
		const tagList = tags.split(',');
		filters[Op.and] = [
			...filters[Op.and] || [],
			{
				[Op.or]: tagList.map(tag => ({
					[Op.or]: [
						{ tag1: tag },
						{ tag2: tag },
						{ tag3: tag },
					],
				})),
			},
		];
	}

	const order = [];
	if (sort) {
		let sTemp = sort.split('-');
		if (sTemp[0] == "score"){
			order.push(sTemp);
		} else {
			order.push(["s_name", sTemp[1]]);
		}
	}

	const exams = await EducationalService.findAll({
		where: filters,
		order,
	});


	let result = [];
	for (let e of exams){
		result.push(convPreviewExam(e.dataValues));
	}

	return res.status(200).json(success("exams", { result }));
}

async function startExam(req, res) {
	const { serviceId } = req.params;
	const exam = await Exam.findOne({ where: { service_id: serviceId } });
	if(!exam)
		return res.status(404).json(error('Exam not found.', 404));

	const registered = await Registers.findOne({ where: { user_id: req.userName, service_id: serviceId } });
	if (!registered)
		return res.status(403).json(error('You are not a member of this service.', 403));

	const examResult = await ExamResult.findOne({ where: { user_id: req.userName, service_id: serviceId} });
	if(examResult && examResult.participation_times >= 1)
		return res.status(403).json(error('You have already taken this test.', 403));

	if(examResult){
		examResult.participation_times = 1;
		examResult.save();
	}
	else
		await ExamResult.create({ service_id: serviceId, user_id: req.userName, participation_times: 1 });

	let selectedQuestions = await SelectedQuestions.findAll({
		where: { service_id: serviceId },
		include: [
			{
				model: Question,
				attributes: [
					'question_id', 'question_name', 'question_text', 'o1', 'o2', 'o3', 'o4',
					'score', 'number_of_voters', 'tag1', 'tag2', 'tag3',
				],
			},
		],
		order: [['sort_number', 'ASC']],
	});

	selectedQuestions = selectedQuestions.map((item) => ({
		sortNumber: item.sort_number,
		...convExamQuestions(item.Question),
	}));

	const examToken = jwt.sign({ user_id: req.userName, service_id: serviceId }, JWT_SECRET, { // good to add start time
		expiresIn: exam.exam_duration * 60,
	});

	const result = { examDuration: exam.exam_duration, examToken, questions: selectedQuestions };
	res.status(200).json(success('Exam started.', result));
}

async function endExam(req, res) {
	const { examToken, answers } = req.body;

	if (!examToken)
		return res.status(400).json(error('Token required.', 400));

	let decoded;
	try {
		decoded = jwt.verify(examToken, JWT_SECRET, { ignoreExpiration: true });
	} catch (err) {
		return res.status(401).json(error('Invalid or expired token.', 401));
	}

	const { service_id, user_id, exp } = decoded;
	if (!service_id || !user_id || !exp)
		return res.status(400).json(error('Invalid token payload.', 400));

	const result = await ExamResult.findOne({ where: { user_id, service_id } });
	if (!result || result.participation_times > 1)
		return res.status(400).json(error('Invalid token payload.', 400));

	// transaction
	result.participation_times = 2;
	await result.save();

	const currentTime = Math.floor(Date.now() / 1000);
	if (currentTime > exp)
		return res.status(204).json(success('Exam time has expired. Your answers will not be recorded.'));

	const selectedQuestions = await SelectedQuestions.findAll({
		where: { service_id },
		include: [
			{
				model: Question,
				attributes: ['question_id', 'right_answer'],
			},
		],
	});

	const questionMap = selectedQuestions.reduce((map, item) => {
		map[item.question_id] = item.Question.right_answer;
		return map;
	}, {});

	const savedAnswers = [];
	for (const answer of answers) {
		const { questionId, userAnswer } = answer;
		if (!questionMap.hasOwnProperty(questionId.toString())) { // Id or _id
			// return res.status(400).json(error(`Invalid question ID: ${questionId}`, 400));
			continue;
		}

		const savedAnswer = await ExamAnswers.create({
			service_id, user_id, question_id: questionId, user_answer: userAnswer, right_answer: questionMap[questionId.toString()],
		});
		savedAnswers.push(savedAnswer);
	}

	res.status(200).json(success('Exam ended successfully.')); // , savedAnswers.map((answer) => answer.toJSON())
}

module.exports = { makeExam, editExam, preview, examPage, exams,
	privateQuestions, addQuestion, deleteQuestion, reorderQuestions,
	startExam, endExam };
