const { Exam, EducationalService, ServiceRecordedScores, Registers, SelectedQuestions } = require('../models');
const { success, error, convPreviewExam } = require('../utils');
const { Op } = require('sequelize');
const { sequelize } = require('../configs/db');

async function makeExam(req, res) {
	req.body.serviceType = '1';
	if (req.body.level == 'Beginner') req.body.level = '1';
	else if (req.body.level == 'Medium') req.body.level = '2';
	else if (req.body.level == 'Advanced') req.body.level = '3';
	else return res.status(400).json(error('Level is not valid.', 400 ));
	
	if (! (req.body.activityStatus == 'A' || req.body.activityStatus == 'P'))
		return res.status(400).json(error('Activity state is not valid.', 400));

	if (req.body.examDuration < 1)
		return res.status(400).json(error('Exam duration is not valid.', 400));

	if (req.body.minPassScore > 100 && req.body.minPassScore < 0)
		return res.status(400).json(error('Minimum grade needed to pass exam is not valid.', 400));

	try {
		const transaction = await sequelize.transaction();
		const newService = await EducationalService.create({ user_id: req.userName,
			s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
			price: req.body.price, service_type: req.body.serviceType, 
			activity_status: req.body.activityStatus, image: req.body.image, tag1: req.body.tag1, 
			tag2: req.body.tag2, tag3: req.body.tag3}, { transaction } );
		const newExam = await Exam.create({ service_id: newService.service_id, 
			exam_duration: req.body.examDuration, 
			min_pass_score: req.body.minPassScore}, { transaction })

		await transaction.commit();

		res.status(201).json(success('Exam created successfully.', { serviceId: newService.service_id }));
	} catch (err) {
		await transaction.rollback();

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error creating exam or service.', 500));
	}
}

async function preview(req, res) {
	req.query.serviceId = parseInt(req.query.serviceId);
	let service = await EducationalService.findOne({ where: { service_id: req.query.serviceId } });
	if (!service || (! service.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));

	const exam = await Exam.findOne({ where: { service_id: req.query.serviceId } });
	const userCount = await Registers.count({ where: { service_id: req.query.serviceId }, });
	const questionCount = await SelectedQuestions.count({ where: { service_id: req.query.serviceId } });

	service = convPreviewExam({ ...service.dataValues, ...exam.dataValues, userCount, questionCount });

	let privatePage = false;
	if (req.userName){
		const registered = await Registers.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName } });
		if (req.userName == service.user_id || registered)
			privatePage = true;
	}

	res.status(200).json(success('Exam', { Exam: service, privatePage }));
}

async function editExam (req, res) {
	if (req.body.activityStatus){
		if (!(req.body.activityStatus == 'P' || req.body.activityStatus == 'A'))
			return res.status(403).json(error('Permission denied.', 403));
	}
	if (!req.body.serviceId)
		return res.status(400).json(error('Misssing serviceId.', 400));

	let service = await EducationalService.findOne( 
		{ where: { service_id: req.body.serviceId, user_id: req.userName } });
	if(!service)
		return res.status(404).json(error('Exam not found.', 404));
	let exam = await Exam.findOne({ where: { service_id: req.body.serviceId } });

	try{
		const transaction = await sequelize.transaction();
		await service.update({
			s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
			price: req.body.price, activity_status: req.body.activityStatus, 
			image: req.body.image, tag1: req.body.tag1, tag2: req.body.tag2, tag3: req.body.tag3
		}, { transaction })
		await exam.update({ exam_duration: req.body.examDuration, min_pass_score: req.body.minPassScore}, { transaction });
		await transaction.commit();

		res.status(201).json(success('Exam edited successfully.', { serviceId: service.service_id })); 
		// return data
	} catch (err) {
		await transaction.rollback();

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error editing exam information.', 500));
	}
}

async function exams(req, res) {
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
				{ service_type: '1', s_level: s_level },
			],
		};
	} else {
		filters = {
			[Op.or]: [
				{ activity_status: 'A' },
				{ user_id: req.userName },
			], [Op.and]: [
				{ service_type: '1', s_level: s_level },
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

	const exams = await EducationalService.findAll({
		where: filters,
		order,
	});


	let result = [];
	for (let e of exams){
		result.push(convPreviewExam(e.dataValues));
	}

	return res.status(200).json(success("exams", { result }));
}

module.exports = { makeExam, editExam, preview, exams };
