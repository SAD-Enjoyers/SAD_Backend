const { Category } = require('../models');
const { success, error } = require('../utils');

async function categories(req, res) {
	let categoryList = await Category.findAll();
	res.status(200).json(success("categoryList", { categoryList }));
}

module.exports = { categories, };