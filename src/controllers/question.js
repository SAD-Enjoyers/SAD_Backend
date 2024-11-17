const { Question } = require('../models');
const { success, error, convQuestion } = require('../utils');

async function addQuestion (req, res) {
	let question = await Question.create({ user_id: req.userName, question_name: req.body.questionName, 
				question_text: req.body.questionText, o1: req.body.o1, o2: req.body.o2, o3: req.body.o3, 
				o4: req.body.o4, right_answer: req.body.rightAnswer, visibility: req.body.visibility, 
				tag1: req.body.tag1, tag2: req.body.tag2, tag3: req.body.tag3});
	question = convQuestion(question);
	return res.status(201).json(success("Question added.", { question }));
}

module.exports = { addQuestion };
