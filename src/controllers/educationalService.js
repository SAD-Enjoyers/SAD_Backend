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

// comment 
// scores
// ...


module.exports = { whichPage };
