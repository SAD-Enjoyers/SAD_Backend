const { Exam, EducationalService, ExamAnswers, Registers, SelectedQuestions, 
	Question, ExamResult } = require('../../models');
const { success, error, } = require('../../utils');
const { sequelize, logger } = require('../../configs');


async function publicExam(req, res, service, serviceId) {
}


module.exports = { publicExam, };
