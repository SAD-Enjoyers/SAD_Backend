const user = require('./user');
const expert = require('./expert');
const educationalService = require('./educationalService');
const category = require('./category');
const question = require('./question');
const exam = require('./exam');

module.exports = {
	...user,
	...expert,
	...educationalService,
	...category,
	...question,
	...exam,
};
