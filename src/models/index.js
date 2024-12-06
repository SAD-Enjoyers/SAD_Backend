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

educationalService.Registers.belongsTo(educationalService.EducationalService, {
	foreignKey: 'service_id',
	onDelete: 'NO ACTION',
	onUpdate: 'CASCADE',
});

educationalService.EducationalService.hasMany(educationalService.Registers, {
	foreignKey: 'service_id',
	onDelete: 'NO ACTION',
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
