const course = require('./course');
const privateCourse = require('./privateCourse');
const publicCourse = require('./publicCourse');

module.exports = {
	...course,
	...privateCourse,
	...publicCourse,
};
