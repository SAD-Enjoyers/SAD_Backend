const { EducationalService, ServiceRecordedScores } = require('../models');
const { success, error } = require('../utils');
const { Op } = require('sequelize');

async function uploadImage(req, res) {
	if (!req.file) {
		return res.status(400).json(error('No file uploaded.', 400));
	}

	res.status(200).json(success('Image uploaded successfully.', { image: req.file.filename} ));
}


// comment 
// scores
// ...


module.exports = { uploadImage };
