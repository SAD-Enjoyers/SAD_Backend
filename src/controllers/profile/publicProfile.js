const { User, BackupUser, Expert, EducationalService } = require('../../models');
const { success, error, convUser, convExpert, convCourseCard, convArticleCard, convExamCard } = require('../../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../../configs');
const { Op } = require('sequelize');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const searchLimit = parseInt(config.app.searchLimit);

async function publicProfile(req, res) {
	const prof = await User.findOne({ where: { user_id: req.params.userId } });
	if (!prof) {
		return res.status(404).json(error('User not found.', 404));
	}
	let userData = convUser(prof);
	return res.status(200).json(success('User Profile:', { userData } ))
}

async function profiles(req, res) {
	const { search, sort } = req.query;

	let filters = {};
	if (search) {
		filters = {
			[Op.or]: [
				{ user_id: { [Op.iLike]: `%${search}%` } },
				{ first_name: { [Op.iLike]: `%${search}%` } },
				{ last_name: { [Op.iLike]: `%${search}%` } },
			],
		};
	}

	const order = [];
	if (sort) {
		let sTemp = sort.split('-');
		order.push(["user_id", sTemp[1]]);
	}

	const users = await User.findAll({
		where: filters,
		order,
		limit: searchLimit,
	});

	let result = [];
	for (let e of users){
		result.push(convUser(e.dataValues));
	}

	return res.status(200).json(success("users", { result }));
}

async function publicCourse(req, res) {
	let createdCourses = await EducationalService.findAll({ where: { user_id: req.params.userId, service_type: '3'
		, activity_status: ['A', 'P'] } });
	createdCourses = createdCourses.map((course) => ({ type: "creator", ...convCourseCard(course.dataValues) }) );

	res.status(200).json(success('Course cards', createdCourses));
}

async function publicArticle(req, res) {
	let createdArticls = await EducationalService.findAll({ where: { user_id: req.params.userId, service_type: '2'
		, activity_status: ['A', 'P'] } });
	createdArticls = createdArticls.map((article) => ({ type: "creator", ...convArticleCard(article.dataValues) }) );

	res.status(200).json(success('Article cards', createdArticls));
}

async function publicExam(req, res) {
	let createdExams = await EducationalService.findAll({ where: { user_id: req.params.userId, service_type: '1'
		, activity_status: ['A', 'P'] } });
	createdExams = createdExams.map((exam) => ({ type: "creator", ...convExamCard(exam.dataValues) }) );

	res.status(200).json(success('Exam cards', createdExams));
}

module.exports = {
	publicProfile, profiles, publicExam, publicArticle, publicCourse,
}
