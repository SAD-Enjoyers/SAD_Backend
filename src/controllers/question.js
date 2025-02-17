const { Question, RecordedScores } = require('../models');
const { success, error, convQuestion } = require('../utils');
const { Op } = require('sequelize');
const { sequelize } =require('../configs');

async function addQuestion (req, res) {
	let question = await Question.create({ user_id: req.userName, question_name: req.body.questionName, 
				question_text: req.body.questionText, o1: req.body.o1, o2: req.body.o2, o3: req.body.o3, 
				o4: req.body.o4, right_answer: req.body.rightAnswer, visibility: req.body.visibility, 
				tag1: req.body.tag1, tag2: req.body.tag2, tag3: req.body.tag3});
	question = convQuestion(question);
	return res.status(201).json(success("Question added.", { question }));
}

async function scoreSubmission(req, res) {
	let question_id = req.body.questionId;
	let user_id = req.userName;
	let question = await Question.findOne({ where: { question_id } });
	if(question.user_id == req.userName){
		return res.status(403).json(error("The user cannot vote on his question.", 403));
	}

	let scored = await RecordedScores.findOne({ where: { question_id, user_id } });
	let score = req.body.scored;
	if(scored){
		// return res.status(403).json(error("You have already rated.", 403));
		scored.score = score;
		await scored.save();

		const newAVG = await RecordedScores.findAll({
			where: { question_id },
			attributes: [[ sequelize.fn('AVG', sequelize.col('score')), 'averageScore', ]],
			raw: true,
		});

		let averageScore = newAVG[0]?.averageScore || 0;
		averageScore = parseFloat(averageScore).toFixed(2);
		question.score = averageScore;
		await question.save();

		res.status(200).json(success("The score was updated.", 
			{ score: question.score, numberOfVoters: question.number_of_voters }));		
	} else {
		if(question.number_of_voters){
			question.score = ((question.score * question.number_of_voters) + score) / (question.number_of_voters + 1);
			question.number_of_voters = question.number_of_voters + 1;
		} else {
			question.number_of_voters = 1;
			question.score = score;
		}
		scored = await RecordedScores.create({ question_id, user_id, score });
		await question.save();
		res.status(200).json(success("The score was recorded.", 
			{ score: question.score, numberOfVoters: question.number_of_voters }));
	}
}

async function getQuestion(req, res) {
	let question_id = req.query.questionId;
	let question = await Question.findOne({ where: { question_id } });
	if (!question)
		return res.status(404).json(error("Question not found."));
	
	let userScore = null;
	if(req.partialAccess){
		if(!question.visibility){
			return res.status(403).json(error("You do not have access to this question.", 403));
		}
	} else {
		if((req.userName != question.user_id) && (!question.visibility)){
			return res.status(403).json(error("You do not have access to this question.", 403));
		}
		userScore = await RecordedScores.findOne({ where: { user_id: req.userName, question_id }});
		if (userScore)
			userScore = parseFloat(userScore.score);
	}
	question = convQuestion(question);
	return res.status(200).json(success("question", { question, userScore }));
}

async function questions(req, res) {
	const { search, tags, sort } = req.query;

	let filters = {};
	if(req.partialAccess){
		filters = {
			[Op.or]: [
				{ visibility: true },
			],
		};
	} else {
		filters = {
			[Op.or]: [
				{ visibility: true },
				{ user_id: req.userName },
			],
		};
	}

	if (search) {
		filters.question_name = {
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
			order.push(["question_name", sTemp[1]]);
		}
	}

	const questions = await Question.findAll({
		where: filters,
		order,
	});


	let result = [];
	for (let q of questions){
		result.push(convQuestion(q.dataValues));
	}

	return res.status(200).json(success("questions", { result }));
}

module.exports = { addQuestion, scoreSubmission, getQuestion, questions };
