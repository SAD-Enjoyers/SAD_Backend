const { Article, EducationalService, Registers, } = require('../../models');
const { success, error, convArticle, convBlog } = require('../../utils');
const { sequelize, logger } = require('../../configs');

async function preview(req, res) {
	let service = await EducationalService.findOne({ where: { service_id: req.params.serviceId } });
	if (!service || (! service.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));
	const userCount = await Registers.count({ where: { service_id: req.params.serviceId } });

	service = convArticle({ ...service.dataValues, userCount });
	let privatePage = false;
	if (req.userName){
		const registered = await Registers.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
		if (req.userName == service.user_id || registered)
			privatePage = true;
	}

	res.status(200).json(success('Article', { Article: service, privatePage }));
}

async function articlePage(req, res) {
	const blog = await Article.findOne({ where: { service_id: req.params.serviceId } });
	if (!blog)
		return res.status(404).json(error("Article not found.", 404));
	let service = await EducationalService.findOne({ where: { service_id: req.params.serviceId } });
	let user = await Registers.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });

	if (req.userName == service.user_id || user){
		return res.status(200).json(success("Blog", convBlog(blog) ));
	} else 
		return res.status(403).json(error('Permission denied.', 403));
}


module.exports = { articlePage, preview };
