const exam = require('./exam');
const privateExam = require('./privateExamPage');
const publicExam = require('./publicExamPage');
const privateQuestions= require('./privateQuestions');
const ongoingExam = require('./ongoingExamPage');


module.exports = {
	...exam,
	...privateExam,
	...publicExam,
	...privateQuestions,
	...ongoingExam,
}
