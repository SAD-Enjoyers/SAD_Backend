const { Question, RecordedScores } = require('../models');
const { success, error, convQuestion } = require('../utils');

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
	if(question.user_id == req.body.userName){
		return res.status(403).json(error("The user cannot vote on his question.", 403));
	}
	let scored = await RecordedScores.findOne({ where: { question_id, user_id } });
	if(scored){
		return res.status(403).json(error("You have already rated.", 403));
	}

	let score = req.body.scored;
	if(question.number_of_voters){
		question.score = ((question.score * question.number_of_voters) + score) / (question.number_of_voters + 1);
		question.number_of_voters = question.number_of_voters + 1;
	} else {
		question.number_of_voters = 1;
		question.score = score;
	}
	scored = await RecordedScores.create({ question_id, user_id, score });
	question.save();
	res.status(200).json(success("The score was recorded.", 
		{ score: question.score, numberOfVoters: question.number_of_voters }));
}

async function getQuestion(req, res) {
	let question_id = req.query.questionId;
	let question = await Question.findOne({ where: { question_id } });
	if((req.userName != question.user_id) && (!question.visibility)){
		return res.status(403).json(error("You do not have access to this question.", 403));
	}
	question = convQuestion(question);
	return res.status(200).json(success("question", { question }));
}

module.exports = { addQuestion, scoreSubmission, getQuestion };
