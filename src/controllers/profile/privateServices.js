const { Registers, EducationalService } = require('../../models');
const { success, error,	convExamCard, convArticleCard } = require('../../utils');

async function examList(req, res) {
	let registeredExams = await Registers.findAll({
		where: { user_id: req.userName },
		include: [
			{
				model: EducationalService,
				where: { service_type: '1' },
				attributes: ['user_id', 'service_id', 's_name', 'description', 'price', 
					's_level', 'score', 'image', 'number_of_voters', 'tag1', 'tag2', 'tag3'],
			},
		],
	});
	registeredExams = registeredExams.map((register) => ({ type: "member", ...convExamCard(register.EducationalService) }));

	let createdExams = await EducationalService.findAll({ where: { user_id: req.userName } });
	createdExams = createdExams.map((exam) => ({ type: "creator", ...convExamCard(exam.dataValues) }) );

	res.status(200).json(success('Exam cards', createdExams.concat(registeredExams)));
}

async function articleList(req, res) {
	let registeredArticls = await Registers.findAll({
		where: { user_id: req.userName },
		include: [
			{
				model: EducationalService,
				where: { service_type: '2' }, // user_id != req.userName
				attributes: ['user_id', 'service_id', 's_name', 'description', 'price', 
					's_level', 'score', 'image', 'number_of_voters', 'tag1', 'tag2', 'tag3'],
			},
		],
	});
	registeredArticls = registeredArticls.map((register) => ({ type: "member", ...convArticleCard(register.EducationalService) }));

	let createdArticle = await EducationalService.findAll({ where: { user_id: req.userName } });
	createdArticle = createdArticle.map((article) => ({ type: "creator", ...convArticleCard(article.dataValues) }) );

	res.status(200).json(success('Article cards', createdArticle.concat(registeredArticls)));
}

module.exports = { examList, articleList };
