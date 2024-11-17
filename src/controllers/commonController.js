const { Category } = require('../models');
const { success, error, convCategory } = require('../utils');

async function categories(req, res) {
	let categoryList = await Category.findAll();
	categoryList = convCategory(categoryList);
	res.status(200).json(success("categoryList", { categoryList }));
}

module.exports = { categories, };