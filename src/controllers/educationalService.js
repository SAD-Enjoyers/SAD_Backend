const { EducationalService, ServiceRecordedScores, Registers, Comment } = require('../models');
const { success, error, convComment } = require('../utils');
const { Op } = require('sequelize');

async function whichPage(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName } });
	if (edu)
		return res.status(200).json(success("creator", { flag: 1 }));

	const reg = await Registers.findOne({ where: { service_id: req.query.serviceId, user_id: req.userName }});
	if (reg)
		return res.status(200).json(success("member", { flag: 2 }));

	res.status(200).json(success("preview", { flag: 3 }));
}

async function tempRegister(req, res) {
	const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId } });
	if (!edu)
		return res.status(404).json(error('Service not found', 404));
	if (edu.user_id == req.userName)
		return res.status(400).json(error('You are the creator of this service.', 400));

	const repeat = await Registers.findOne({ where: { user_id: req.userName, service_id: req.body.serviceId } });
	if (repeat)
		return res.status(400).json(error('You already register in this service.', 400));

	const reg = await Registers.create({ user_id: req.userName, service_id: req.body.serviceId });

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

// scores
// ...


module.exports = { whichPage, tempRegister, comments, addComment };
