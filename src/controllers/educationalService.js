const { EducationalService, ServiceRecordedScores, Registers } = require('../models');
const { success, error } = require('../utils');
const { Op } = require('sequelize');

async function whichPage(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName } });
	if (edu)
		return res.status(200).json(success("creator", { flag: 1 }));

	const reg = await Registers.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName }});
	if (reg)
		return res.status(200).json(success("member", { flag: 2 }));

	res.status(200).json(success("preview", { flag: 3 }));
}

async function tempRegister(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId } });
	if (!edu)
		return res.status(404).json(error('Service not found', 404));
	if (edu.user_id == req.userName)
		return res.status(400).json(error('You are the creator of this service.', 400));

	const repeat = await Registers.findOne({ where: { user_id: req.userName, service_id: req.body.serviceId } });
	if (repeat)
		return res.status(400).json(error('You already register in this service.', 400));

	const reg = await Registers.create({ user_id: req.userName, service_id: req.body.serviceId });

	res.status(201).json(success('Registration was successful.', { serviceId: req.body.serviceId } ));
}

// comment 
// scores
// ...


module.exports = { whichPage, tempRegister };
