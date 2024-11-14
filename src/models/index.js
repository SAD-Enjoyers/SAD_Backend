const user = require('./user');
const expert = require('./expert');
const educationalService = require('./educationalService');

module.exports = {
	...user,
	expert,
	...educationalService
};
