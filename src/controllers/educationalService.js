const { EducationalService, ServiceRecordedScores, Registers } = require('../models');
const { success, error } = require('../utils');
const { Op } = require('sequelize');

async function uploadImage(req, res) {
	if (!req.file) {
		return res.status(400).json(error('No file uploaded.', 400));
	}

	res.status(200).json(success('Image uploaded successfully.', { image: req.file.filename} ));
}

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


module.exports = { uploadImage, whichPage };
