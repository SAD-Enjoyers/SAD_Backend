const { Category, Ticket, Registers, EducationalService } = require('../models');
const { success, error, convCategory, convTicket } = require('../utils');

async function categories(req, res) {
	let categoryList = await Category.findAll();
	categoryList = convCategory(categoryList);
	res.status(200).json(success("categoryList", { categoryList }));
}

async function uploadFile(req, res) {
	if (!req.file) {
		return res.status(400).json(error('No file uploaded.', 400));
	}

	res.status(200).json(success('Uploaded successfully.', { fileName: req.file.filename} ));
}

async function registerTicket(req, res) {
	if (req.role == 'user'){
		if (!req.body.serviceId || !req.body.message)
			return res.status(404).json(error('ServiceId and message required.', 404));
		
		const edu = await EducationalService.findOne({ where: { service_id: req.body.serviceId } });
		if (!edu)
			return res.status(404).json(error('Service not found.', 404));
		const reg = await Registers.findOne({ where: { user_id: req.userName, service_id: req.body.serviceId } });
		if(!reg && edu.user_id != req.userName) 
			return res.status(404).json(error('You are not registered in this service.', 404));

		let ticket = await Ticket.findOne({ where: { user_id: req.userName, service_id: req.body.serviceId, t_state: 1 } });
		if (ticket)
			return res.status(403).json(error('Your latest ticket for this service is under review.', 403));
		
		ticket = await Ticket.create({ user_id: req.userName, service_id: req.body.serviceId,
			t_message: req.body.message, t_state: 1, report_time: new Date() });
		res.status(201).json(success('Ticket successfully registered.', convTicket(ticket)));
	} else 
		return res.status(403).json(error('Permission denied.', 403));
}

module.exports = { categories, uploadFile, registerTicket };
