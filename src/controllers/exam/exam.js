const { Exam, EducationalService, ExamAnswers, Registers, SelectedQuestions, } = require('../../models');
const { success, error, convPreviewExam, } = require('../../utils');
const { Op } = require('sequelize');
const { sequelize, logger } = require('../../configs');
const { privateExam } = require('./privateExamPage');
const { publicExam } = require('./publicExamPage');


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

	// no need for flag
	res.status(200).json(success('Exam', { Exam: service, privatePage }));
}

async function examPage(req, res) {
	const { serviceId } = req.params;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });
	let users = await Registers.findOne({ where: { service_id: serviceId, user_id: req.userName } });
	if (service.service_type == '1'){
		if (req.userName == service.user_id)
			privateExam(req, res, service, serviceId);
		else if (users)
			publicExam(req, res, service, serviceId);
		else
			return res.status(403).json(error('Permission denied.', 403));
	} else
		return res.status(303).json(error('See other services.', 303));
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


module.exports = { preview, examPage, exams, };
