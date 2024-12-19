const serviceImage = require('./serviceImage');
const profileImage = require('./profileImage');
const articleAttachment = require('./articleAttachment');

module.exports = {
	...serviceImage,
	...profileImage,
	...articleAttachment,
};
