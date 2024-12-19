const { Category } = require('../models');
const { success, error, convCategory } = require('../utils');

async function categories(req, res) {
	let categoryList = await Category.findAll();
	categoryList = convCategory(categoryList);
	res.status(200).json(success("categoryList", { categoryList }));
}

async function uploadFile(req, res) {
	if (!req.file) {
		return res.status(400).json(error('No file uploaded.', 400));
	}

	res.status(200).json(success('Uploaded successfully.', { file: req.file.filename} ));
}

module.exports = { categories, uploadFile };