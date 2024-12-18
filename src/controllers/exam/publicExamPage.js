const { Exam, EducationalService, ExamAnswers, Registers, SelectedQuestions, 
	Question, ExamResult } = require('../../models');
const { success, error, convExam, convExamResult } = require('../../utils');
const { sequelize, logger } = require('../../configs');

async function examResult(req, res) {
	const examResult = await ExamResult.findOne({ where: { user_id: req.userName, service_id: req.params.serviceId } });
	if(!examResult)
		return res.status(404).json(error("You haven't taken the test yet.", 404));
	else if(examResult.participation_times == 1)
		return res.status(404).json(error("The exam is underway.", 404));
	else if(examResult.participation_times == 2){
		const numberAnswers = await SelectedQuestions.count({ where: { service_id: req.params.serviceId } });
		if (numberAnswers == 0)
			return res.status(500).json(error("No question found for this exam.", 500));
		const answers = await ExamAnswers.findAll({ where: { user_id: req.userName, service_id: req.params.serviceId } });
		let trueA = 0, wrongA = 0;
		for (let ans of answers){
			if(ans.user_answer == ans.right_answer)
				trueA += 1;
			else
				wrongA += 1;
		}
		examResult.right_answers = trueA; examResult.wrong_answers = wrongA;
		examResult.empty_answers = numberAnswers - (trueA + wrongA);
		examResult.exam_score = (trueA * 100) / numberAnswers;
		const exam = await Exam.findOne({ where: { service_id: req.params.serviceId } });
		if (!exam)
			return res.status(500).json(error("Exam not found.", 500));
		else if (examResult.exam_score >= exam.min_pass_score)
			examResult.passed = 'P';
		else
			examResult.passed = 'R';
		examResult.participation_times = 3;
		await examResult.save();

		res.status(200).json(success("Result", convExamResult(examResult)));
	} else {
		res.status(200).json(success("Result", convExamResult(examResult)));
	}
}

module.exports = { examResult };
