const { EducationalService, ServiceRecordedScores, Registers, Comment, Transaction, User } = require('../models');
const { success, error, convComment } = require('../utils');
const { Op } = require('sequelize');
const { sequelize } =require('../configs');

async function whichPage(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName } });
	if (edu)
		return res.status(200).json(success("creator", { flag: 1 }));

	const reg = await Registers.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName }});
	if (reg)
		return res.status(200).json(success("member", { flag: 2 }));

	res.status(200).json(success("preview", { flag: 3 }));
}

async function registerService(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId } });
	if (!edu)
		return res.status(404).json(error('Service not found', 404));
	else if (edu.user_id == req.userName)
		return res.status(400).json(error('You are the creator of this service.', 400));
	else if (edu.activity_status != 'A')
		return res.status(403).json(error('You cant register in this service.', 403));

	const repeat = await Registers.findOne({ where: { user_id: req.userName, service_id: req.body.serviceId } });
	if (repeat)
		return res.status(400).json(error('You already register in this service.', 400));

	const student = await User.findOne({ where: { user_id: req.userName } });
	if (!student || !student.balance || student.balance < edu.price)
		return res.status(403).json(error('You do not have enough balance for this.', 403));

	const owner = await User.findOne({ where: { user_id: edu.user_id } });
	if (!owner.balance)
		owner.balance = 0;
	owner.balance = parseFloat(owner.balance) + parseFloat(edu.price);
	student.balance = parseFloat(student.balance) - parseFloat(edu.price);
	const buy = await Transaction.create({ user_id: req.userName, t_time: new Date(), t_type: '3', t_volume: edu.price });
	const sell = await Transaction.create({ user_id: edu.user_id, t_time: new Date(), t_type: '4', t_volume: edu.price });
	const reg = await Registers.create({ user_id: req.userName, service_id: req.body.serviceId });
	await student.save();
	await owner.save();
	// transaction

	res.status(201).json(success('Registration was successful.', { serviceId: req.body.serviceId } ));
}

async function comments(req, res) {
	const { page = 1 } = req.query;
	const limit = 15;
	const offset = (page - 1) * limit;

	const edu = await EducationalService.findOne({ where: { service_id: req.params.serviceId } });
	if (!edu)
		return res.status(404).json(error('Service not found.', 404));

	const comments = await Comment.findAll({
		where: { service_id: req.params.serviceId },
		order: [['c_date', 'DESC']],
		limit,
		offset,
	});
	if (!comments.length)
		return res.status(404).json(error('No comments found.', 404));

	res.status(200).json(success('Comments', comments.map((c) => convComment(c.toJSON()))));
}

async function addComment(req, res) {
	// also we can add limit to number of comments
	if (!req.body.serviceId || !req.body.text)
		return res.status(400).json(error('Parameters missing', 400));

	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId } });
	if (!edu)
		return res.status(404).json(error('Service not found.', 404));
	
	const reg = await Registers.findOne({ where: { user_id: req.userName, service_id: req.body.serviceId } });
	if (!reg && edu.user_id != req.userName)
		return res.status(403).json(error('Permission denied.', 403));

	if(req.body.parentComment){
		const parent = await Comment.findOne({ where: { comment_id: req.body.parentComment } });
		if (!parent)
			return res.status(404).json(error('Parent comment not found.', 404));
		if (parent.service_id != req.body.serviceId)
			return res.status(400).json(error('Parent comment does not belong to this service.', 400));
	} else 
		req.body.parentComment = null;

	const comment = await Comment.create({ service_id: req.body.serviceId, user_id: req.userName, 
		parent_comment: req.body.parentComment, c_text: req.body.text, c_date: new Date() });

	res.status(200).json(success('Comment added successfully.', convComment(comment)));
}

async function scoreSubmission(req, res) {
	let service_id = req.body.serviceId;
	let user_id = req.userName;
	let service = await EducationalService.findOne({ where: { service_id } });
	if (!service)
		return res.status(404).json(error("Service not found.", 404));
	if(service.user_id == req.userName){
		return res.status(403).json(error("The user cannot vote on his service.", 403));
	}
	const reg = await Registers.findOne({ where: { service_id, user_id } });
	if (!reg)
		return res.status(403).json(error("Permission denied.", 403));

	let scored = await ServiceRecordedScores.findOne({ where: { service_id, user_id } });
	let score = req.body.scored;
	if(scored){
		// return res.status(403).json(error("You have already rated.", 403));
		scored.score = score;
		await scored.save();

		const newAVG = await ServiceRecordedScores.findAll({
			where: { service_id },
			attributes: [[ sequelize.fn('AVG', sequelize.col('score')), 'averageScore', ]],
			raw: true,
		});

		let averageScore = newAVG[0]?.averageScore || 0;
		averageScore = parseFloat(averageScore).toFixed(2);
		service.score = averageScore;
		await service.save();

		res.status(200).json(success("The score was updated.", 
			{ score: service.score, numberOfVoters: service.number_of_voters }));
	} else {
		if(service.number_of_voters){
			service.score = ((service.score * service.number_of_voters) + score) / (service.number_of_voters + 1);
			service.number_of_voters = service.number_of_voters + 1;
		} else {
			service.number_of_voters = 1;
			service.score = score;
		}
		scored = await ServiceRecordedScores.create({ service_id, user_id, score }); // transaction
		await service.save();
		res.status(200).json(success("The score was recorded.", 
			{ score: service.score, numberOfVoters: service.number_of_voters }));
	}
}

module.exports = { whichPage, registerService, comments, addComment, scoreSubmission };
