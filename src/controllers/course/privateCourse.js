const { Video, EducationalService } = require('../../models');
const { success, error, convVideo } = require('../../utils');
const { sequelize } = require('../../configs');


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
	// body...
}

module.exports = {
	addCourse,
	addVideo,
};
