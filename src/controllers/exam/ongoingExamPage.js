const { Exam, ExamAnswers, Registers, SelectedQuestions, Question, ExamResult } = require('../../models');
const { success, error, convExamQuestions } = require('../../utils');
const jwt = require('jsonwebtoken');
const { sequelize, logger } = require('../../configs');

const JWT_SECRET = process.env.JWT_SECRET;


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


module.exports = { startExam, endExam };
