const { Article, EducationalService, Registers, } = require('../../models');
const { success, error, convArticle, convBlog } = require('../../utils');
const { sequelize, logger } = require('../../configs');

async function makeArticle(req, res) {
	req.body.serviceType = '2';
	if (req.body.level == 'Beginner') req.body.level = '1';
	else if (req.body.level == 'Medium') req.body.level = '2';
	else if (req.body.level == 'Advanced') req.body.level = '3';
	else return res.status(400).json(error('Level is not valid.', 400 ));
	
	if (req.body.activityStatus){
		if (req.body.activityStatus == 'Passive')
			req.body.activityStatus = 'P';
		else if (req.body.activityStatus == 'Active')
			req.body.activityStatus = 'A';
		else if (req.body.activityStatus == 'Suspended')
			return res.status(403).json(error('Permission denied.', 403));
		else
			return res.status(400).json(error('Activity state is not valid.', 400));
	}

	const newService = await EducationalService.create({ user_id: req.userName,
		s_name: req.body.name, description: req.body.description, s_level: req.body.level, 
		price: req.body.price, service_type: req.body.serviceType, 
		activity_status: req.body.activityStatus, image: req.body.image, tag1: req.body.tag1, 
		tag2: req.body.tag2, tag3: req.body.tag3});

	res.status(201).json(success('Article created successfully.', { serviceId: newService.service_id }));
}

async function editArticle(req, res) {
	if (!req.body.title || !req.body.text)
		return res.status(400).json(error("Required parameter missing.", 400));
	const edu = await EducationalService.findOne({ where: { service_id: req.params.serviceId } });
	if (!edu || edu.user_id != req.userName)
		return res.status(404).json(error("Service not found.", 404));

	req.body.attachment = req.body.attachment ? req.body.attachment : null;
	let blog = await Article.findOne({ where: { service_id: req.params.serviceId } });
	if (blog){
		blog.title = req.body.title; blog.a_text = req.body.text; blog.attachment = req.body.attachment;
		await blog.save();
		return res.status(200).json(success("Blog", convBlog(blog)));
	} else {
		blog = await Article.create({ service_id: req.params.serviceId, title: req.body.title, 
			a_text: req.body.text, attachment: req.body.attachment });
		return res.status(200).json(success("Blog", convBlog(blog)));
	}
}


module.exports = { makeArticle, editArticle, };
