const { Exam, EducationalService, Registers, SelectedQuestions, } = require('../../models');
const { success, error, convExam, } = require('../../utils');
const { sequelize, logger } = require('../../configs');


async function makeExam(req, res) {
	req.body.serviceType = '1';
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

	if (req.body.examDuration < 1)
		return res.status(400).json(error('Exam duration is not valid.', 400));

	if (req.body.minPassScore > 100 && req.body.minPassScore < 0)
		return res.status(400).json(error('Minimum grade needed to pass exam is not valid.', 400));

	const transaction = await sequelize.transaction();
	try {
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

async function editExam (req, res) {
	if (req.body.activityStatus){
		if (req.body.activityStatus == 'Passive')
			req.body.activityStatus = 'P';
		else if (req.body.activityStatus == 'Active')
			req.body.activityStatus = 'A';
		else 
			return res.status(403).json(error('Permission denied.', 403));
	}

	if(req.body.level){
		if (req.body.level == 'Beginner') req.body.level = '1';
		else if (req.body.level == 'Medium') req.body.level = '2';
		else if (req.body.level == 'Advanced') req.body.level = '3';
		else return res.status(400).json(error('Level is not valid.', 400 ));
	}

	if (!req.body.serviceId)
		return res.status(400).json(error('Misssing serviceId.', 400));

	let service = await EducationalService.findOne( 
		{ where: { service_id: req.body.serviceId, user_id: req.userName } });
	if(!service)
		return res.status(404).json(error('Exam not found.', 404));
	let exam = await Exam.findOne({ where: { service_id: req.body.serviceId } });

	const transaction = await sequelize.transaction();
	try{
		await service.update({
			s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
			price: req.body.price, activity_status: req.body.activityStatus, 
			image: req.body.image, tag1: req.body.tag1, tag2: req.body.tag2, tag3: req.body.tag3
		}, { transaction })
		await exam.update({ exam_duration: req.body.examDuration, min_pass_score: req.body.minPassScore}, { transaction });
		await transaction.commit();

		res.status(201).json(success('Exam edited successfully.', { serviceId: service.service_id })); 
	} catch (err) {
		await transaction.rollback();

		logger.error(`Error: ${req.method}, ${req.url}: \n${err.message} \n`);
		res.status(500).json(error('Error editing exam information.', 500));
	}
}


module.exports = { makeExam, editExam, };
