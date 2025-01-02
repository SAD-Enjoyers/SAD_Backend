const { Video, EducationalService } = require('../../models');
const { success, error, convVideo } = require('../../utils');
const { sequelize, logger } = require('../../configs');
const { Op } = require('sequelize');

async function addCourse(req, res) {
	req.body.serviceType = '3';
	if (req.body.level == 'Beginner') req.body.level = '1';
	else if (req.body.level == 'Medium') req.body.level = '2';
	else if (req.body.level == 'Advanced') req.body.level = '3';
	else return res.status(400).json(error('Level is not valid.', 400 ));
	
	if (req.body.activityStatus){
		if (req.body.activityStatus == 'Passive')
			req.body.activityStatus = 'P';
		else if (req.body.activityStatus == 'Active')
			req.body.activityStatus = 'A';
		else if (req.body.activityStatus == 'Suspended')
			return res.status(403).json(error('Permission denied.', 403));
		else
			return res.status(400).json(error('Activity state is not valid.', 400));
	}

	const newService = await EducationalService.create({ user_id: req.userName,
		s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
		price: req.body.price, service_type: req.body.serviceType, 
		activity_status: req.body.activityStatus, image: req.body.image, tag1: req.body.tag1, 
		tag2: req.body.tag2, tag3: req.body.tag3});

	res.status(201).json(success('Course created successfully.', { serviceId: newService.service_id }));
}

async function addVideo(req, res) {
	if (!req.body.title || !req.body.address)
		return res.status(404).json(error('Missing arguments.', 404));

	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId, 
		user_id: req.userName, service_type: "3" } });
	if (!edu)
		return res.status(403).json(error('Permission denied.', 403));

	let videos = await Video.count({ where: { service_id: req.body.serviceId } });
	videos = videos + 1;

	// next update add time of videos
	const video = await Video.create({ service_id: req.body.serviceId, user_id: req.userName, 
		title: req.body.title, v_description: req.body.description, sort_number: videos,
		address: req.body.address });

	res.status(201).json(success('Video added successfully.', convVideo(video)));
}

async function editVideo(req, res) {
	if (!req.body.title)
		return res.status(404).json(error('Missing arguments.', 404));

	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId, 
		user_id: req.userName, service_type: "3" } });
	if (!edu)
		return res.status(403).json(error('Permission denied.', 403));

	let video = await Video.findOne({ where: { service_id: req.body.serviceId, video_id: req.body.videoId } });
	if (!video)
		return res.status(404).json(error('Video not found.', 404));

	await video.update({'title': req.body.title, 'v_description': req.body.description });
	res.status(200).json(success('Video updated successfully.', convVideo(video)));
}

async function deleteVideo(req, res) {
	if (!req.body.sortNumber)
		return res.status(404).json(error('Missing arguments.', 404));

	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId, 
		user_id: req.userName, service_type: "3" } });
	if (!edu)
		return res.status(403).json(error('Permission denied.', 403));

	const transaction = await sequelize.transaction();
	try{
		const deleted = await Video.destroy({
			where: { service_id: req.body.serviceId, 
			video_id: req.body.videoId, sort_number: req.body.sortNumber },
		}, { transaction });

		if (!deleted){
			await transaction.rollback();
			return res.status(404).json(error('Question not found in the selected list.', 404));
		}
		await Video.update(
			{ sort_number: sequelize.literal('sort_number - 1') },
			{
				where: {
					service_id: req.body.serviceId,
					sort_number: { [Op.gt]: req.body.sortNumber },
				},
			},
		{ transaction });
		await transaction.commit();

		// need to delete file in storage?
		res.status(200).json(success('Video deleted and sort numbers updated successfully.', 200));

	} catch (err) {
		await transaction.rollback(); // have bugs deleted video not backed?

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error deleting video.', 500));
	}
}

module.exports = {
	addCourse,
	addVideo,
	editVideo,
	deleteVideo,
};
