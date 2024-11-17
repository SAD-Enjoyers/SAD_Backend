const user = require('./user');
const expert = require('./expert');
const educationalService = require('./educationalService');
const category = require('./category');
const question = require('./question');

module.exports = {
	...user,
	...expert,
	...educationalService,
	...category,
	...question,
};
