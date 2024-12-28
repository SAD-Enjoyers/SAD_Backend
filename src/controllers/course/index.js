const course = require('./course');
const privateCourse = require('./privateCourse');

module.exports = {
	...course,
	...privateCourse,
};
