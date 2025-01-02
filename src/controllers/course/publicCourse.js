const { EducationalService, Registers, Video, User } = require('../../models');
const { success, error, convCourse, convVideo } = require('../../utils');
const { sequelize } = require('../../configs');

async function playList(req, res){
	const edu = await EducationalService.findOne({ where: { service_id: req.params.serviceId }});
	if (!edu)
		return res.status(404).json(error('Service not found.', 404));

	const reg = await Registers.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
	if (!reg && !(edu.user_id == req.userName))
		return res.status(403).json(error('Permission denied.', 403));

	const videos = await Video.findAll({ where: { service_id: req.params.serviceId }, order: [['sort_number', 'ASC']] });
	videos.map((v) => {
		v = convVideo(v);
	});
	return res.status(200).json(success('playList', { thumbnail: edu.image, playList: videos }));
}

module.exports = {
	playList,
}
