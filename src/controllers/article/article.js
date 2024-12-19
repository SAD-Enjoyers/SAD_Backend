const { Article, EducationalService, Registers, } = require('../../models');
const { success, error, convArticle } = require('../../utils');
const { sequelize, logger } = require('../../configs');

async function preview(req, res) {
	req.query.serviceId = parseInt(req.query.serviceId);
	let service = await EducationalService.findOne({ where: { service_id: req.query.serviceId } });
	if (!service || (! service.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));

	const exam = await Article.findOne({ where: { service_id: req.query.serviceId } });
	const userCount = await Registers.count({ where: { service_id: req.query.serviceId }, });

	service = convArticle({ ...service.dataValues, ...exam.dataValues, userCount });

	let privatePage = false;
	if (req.userName){
		const registered = await Registers.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName } });
		if (req.userName == service.user_id || registered)
			privatePage = true;
	}

	res.status(200).json(success('Article', { Article: service, privatePage }));
}

async function articlePage(req, res) {
	const { serviceId } = req.params;
	let service = await EducationalService.findOne({ where: { service_id: serviceId } });
	let user = await Registers.findOne({ where: { service_id: serviceId, user_id: req.userName } });
	if (service && service.service_type == '2'){

		if (req.userName == service.user_id || user){
			const article = await Article.findOne({ where: { service_id: serviceId } });
			if (!article)
				return res.status(400).json(error('Article information is corrupted.', 400));
			const userCount = await Registers.count({ where: { service_id: serviceId } });
			service = convArticle({ ...service.dataValues, ...article.dataValues, userCount });

			return res.status(200).json(success('Article information', service));
		}
		else
			return res.status(403).json(error('Permission denied.', 403));
	} else
		return res.status(303).json(error('See other services.', 303));
}
