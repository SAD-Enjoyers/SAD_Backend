const user = require('./user');
const expert = require('./expert');
const educationalService = require('./educationalService');
const category = require('./category');
const question = require('./question');
const exam = require('./exam');
const article = require('./article');
const video = require('./course');

// -----------------------------------------------------------------
// @ Question <-> Exam
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

// -----------------------------------------------------------------
// @ EducationalService <-> Registers
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

// -----------------------------------------------------------------
// @ User <-> Registers
user.User.hasMany(educationalService.Registers, {
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

educationalService.Registers.belongsTo(user.User, {
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// -----------------------------------------------------------------
// @ User <-> ExamResult
user.User.hasMany(exam.ExamResult, {
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

exam.ExamResult.belongsTo(user.User, {
	foreignKey: 'user_id',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// -----------------------------------------------------------------
module.exports = {
	...user,
	...expert,
	...educationalService,
	...category,
	...question,
	...exam,
	...article,
	...video,
};
