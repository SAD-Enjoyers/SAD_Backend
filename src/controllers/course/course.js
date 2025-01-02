const { EducationalService, Registers, Video, User } = require('../../models');
const { success, error, convCourse, convPreviewExam } = require('../../utils');
const { Op } = require('sequelize');
const { sequelize } = require('../../configs');

async function courses(req, res) {
	const { search, tags, sort, level } = req.query;

	let s_level = '1';
	if(level){
		if (level == 'Beginner') s_level = '1';
		else if (level == 'Medium') s_level = '2';
		else if (level == 'Advanced') s_level = '3';
		else return res.status(400).json(error('Level is not valid.', 400 ));
	} else 
		s_level = [ '1', '2', '3' ];

	let filters = {};
	if(req.partialAccess){
		filters = {
			[Op.or]: [
				{ activity_status: 'A' },
			], [Op.and]: [
				{ service_type: '3', s_level: s_level },
			],
		};
	} else {
		filters = {
			[Op.or]: [
				{ activity_status: 'A' },
				{ user_id: req.userName },
			], [Op.and]: [
				{ service_type: '3', s_level: s_level },
			],
		};
	}

	if (search) {
		filters.s_name = {
			[Op.iLike]: `%${search}%`,
		};
	}

	if (tags) {
		const tagList = tags.split(',');
		filters[Op.and] = [
			...filters[Op.and] || [],
			{
				[Op.or]: tagList.map(tag => ({
					[Op.or]: [
						{ tag1: tag },
						{ tag2: tag },
						{ tag3: tag },
					],
				})),
			},
		];
	}

	const order = [];
	if (sort) {
		let sTemp = sort.split('-');
		if (sTemp[0] == "score"){
			order.push(sTemp);
		} else {
			order.push(["s_name", sTemp[1]]);
		}
	}

	const course = await EducationalService.findAll({
		where: filters,
		order,
	});

	let result = [];
	for (let e of course){
		result.push(convPreviewExam(e.dataValues));
	}

	return res.status(200).json(success("course", { result }));
}

async function preview(req, res) {
	let edu = await EducationalService.findOne({ where: { service_id: req.params.serviceId, service_type: "3" } });
	if (!edu || (! edu.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));
	const videos = await Video.count({ where: { service_id: req.params.serviceId } });
	const userCount = await Registers.count({ where: { service_id: req.params.serviceId } });

	edu = convCourse({ ...edu.dataValues, userCount, videos });

	let privatePage = false;
	if (req.userName){
		// it can be optimize by first check edu.user_id
		const registered = await Registers.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
		if (req.userName == edu.userId || registered)
			privatePage = true;
	}

	res.status(200).json(success('Course', { Course: edu, privatePage }));
}

async function Participants(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
	if (!edu)
		res.status(404).json(error("Service not found.", 404));

	// const participants = await Registers.findAll({ where: { service_id: req.params.serviceId }, });

	// if (!participants || participants.length === 0)
	// 	return res.status(404).json(error('No participants found for this exam.', 404));

	let userList = await Registers.findAll(
		{
			where: { service_id: req.params.serviceId },
			include:
			[
				{
					model: User,
					// where: { user_id: person.user_id, participation_times: 3 },
					// required: false, // Allows users without results to be included
					attributes: ['user_id', 'first_name', 'last_name', 'email', 'image'],
				},
			],
		}
	);
	let users = [];
	userList.map((u) => {
		users.push({
			userId: u.User.user_id,
			firstName: u.User.first_name,
			lastName: u.User.last_name,
			email: u.User.email,
			image: u.User.image,
		});		
	});
	
	res.status(200).json(success("Participants", users));
}


module.exports = {
	courses, preview, Participants, 
};
