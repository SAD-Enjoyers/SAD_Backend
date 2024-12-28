const serviceImage = require('./serviceImage');
const profileImage = require('./profileImage');
const articleAttachment = require('./articleAttachment');
const courseVideo = require('./courseVideo');

module.exports = {
	...serviceImage,
	...profileImage,
	...articleAttachment,
	...courseVideo,
};
