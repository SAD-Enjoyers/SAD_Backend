const { Article, EducationalService, Registers, ServiceRecordedScores, } = require('../../models');
const { success, error, convArticle, convBlog, convArticleCard } = require('../../utils');
const { sequelize, logger } = require('../../configs');
const { Op } = require('sequelize');

async function preview(req, res) {
	let service = await EducationalService.findOne({ where: { service_id: req.params.serviceId } });
	if (!service || (! service.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));
	const userCount = await Registers.count({ where: { service_id: req.params.serviceId } });

	service = convArticle({ ...service.dataValues, userCount });
	let privatePage = false;
	if (req.userName){
		const registered = await Registers.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
		if (req.userName == service.userId || registered)
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
		let userScore = null;
		userScore = await ServiceRecordedScores.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
		if (userScore)
			userScore = { userScore: parseFloat(userScore.score) };
		else
			userScore = { userScore: null };
		let newBlog = convBlog(blog);
		return res.status(200).json(success("Blog", {...newBlog, ...userScore} ));
	} else 
		return res.status(403).json(error('Permission denied.', 403));
}

async function articles(req, res) {
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
				{ service_type: '2', s_level: s_level },
			],
		};
	} else {
		filters = {
			[Op.or]: [
				{ activity_status: 'A' },
				{ user_id: req.userName },
			], [Op.and]: [
				{ service_type: '2', s_level: s_level },
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

	const articles = await EducationalService.findAll({
		where: filters,
		order,
	});


	let result = [];
	for (let e of articles){
		result.push(convArticleCard(e.dataValues));
	}

	return res.status(200).json(success("articles", { result }));
}

module.exports = { articlePage, preview, articles };
