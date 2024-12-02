const user = require('./user');
const expert = require('./expert');
const educationalService = require('./educationalService');
const category = require('./category');
const question = require('./question');
const exam = require('./exam');

exam.SelectedQuestions.belongsTo(question.Question, {
	foreignKey: 'question_id',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

question.Question.hasMany(exam.SelectedQuestions, {
	foreignKey: 'question_id',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

module.exports = {
	...user,
	...expert,
	...educationalService,
	...category,
	...question,
	...exam,
};
