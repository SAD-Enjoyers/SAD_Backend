const { Exam, EducationalService, ServiceRecordedScores } = require('../models');
const { success, error } = require('../utils');
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

		res.status(201).json(success('Exam created successfully', { serviceId: newService.service_id }));
	} catch (err) {
		await transaction.rollback();

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error creating exam or service', 500));
	}
}

module.exports = { makeExam };
