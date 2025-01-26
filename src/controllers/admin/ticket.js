const { Expert, Ticket, EducationalService, User, NotifyUser } = require('../../models');
const { success, error, convExpert, hashPassword, convTicket, convService } = require('../../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../../configs');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const JWT_SECRET = process.env.JWT_SECRET;
const userExpirationTime = config.server.userExpirationTime;

async function searchTicket(req, res) {
	if(req.role == 'expert'){
		const { ticketId, userId } = req.query;
		if (!ticketId && !userId) 
			return res.status(400).json(error('Please provide either ticketId or userId to search.', 400));

		const filters = {};
		if (ticketId)
			filters.ticket_id = ticketId;
		if (userId)
			filters.user_id = userId;

		let tickets = await Ticket.findAll({ where: filters, });
		if (tickets.length === 0) {
			return res.status(404).json(error('No tickets found matching the criteria.', 404));
		}
		tickets = tickets.map((item) => ({ ...convTicket(item) }));

		res.status(200).json(success('Tickets retrieved successfully.', tickets));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function newTicket(req, res) {
	if (req.role == 'expert') {
		let tickets = await Ticket.findAll({
			where: { t_state: {[Op.lt]: 3,},},
			order: [['report_time', 'DESC']],
		});
		if(!tickets || !tickets.length){
			return res.status(200).json(success('No Ticket available.', {}));
		}
		tickets = tickets.map((item) => ({ ...convTicket(item) }));
		return res.status(200).json(success('Tickets:', tickets));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function updateTicket(req, res){
	if (req.role == 'expert'){
		let ticket = await Ticket.findOne({ where: { ticket_id: req.body.ticketId } });
		if (!ticket)
			return res.status(404).json(error('No ticket found.', 404));

		let updates = { expert_id: req.userName };
		if (req.body['state'] !== undefined){
			if(req.body['state'] == 'Pending')
				req.body['state'] = 1;
			else if(req.body['state'] == 'Under review')
				req.body['state'] = 2;
			else if ('Checked')
				req.body['state'] = 3;
			updates['t_state'] = req.body['state'];
		}
		if (req.body['answer'] !== undefined)
			updates['answer'] = req.body['answer'];

		await ticket.update(updates);
		res.status(200).json(success('Ticket updated.', convTicket(ticket)));

		let user = await NotifyUser.findOne({ where: { user_id: ticket.user_id } });
		if (user)
			await user.update({ state: 1 });
		else
			await NotifyUser.create({ user_id: ticket.user_id, state: 1 });

	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function changeServiceState(req, res) {
	if (req.role == 'expert'){
		if (!req.query.activityStatus || !req.query.serviceId)
			return res.status(400).json(error('activityStatus and serviceId required.', 400));
		let activityStatus = 'A';
		if (req.query.activityStatus == 'Active')
			activityStatus = 'A';
		else if (req.query.activityStatus == 'Suspended')
			activityStatus = 'S';
		else if (req.query.activityStatus == 'Passive')
			activityStatus = 'P';
		else
			return res.status(400).json(error('activityStatus is not valid.', 400));

		let edu = await EducationalService.findOne({ where: { service_id: req.query.serviceId } });
		if (!edu)
			return res.status(404).json(error('Service not found.', 404));
		
		await edu.update({ activity_status: activityStatus });

		res.status(204).json(success('Service updated.', {}));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function getUserSession(req, res) {
	if (req.role == 'expert'){
		if(!req.query.userId)
			return res.status(400).json(error("Missing parameter.", 400));
		let user = await User.findOne({ where: { user_id: req.query.userId } });
		if (!user)
			return res.status(404).json(error('User not found', 404));

		let jwtToken = jwt.sign({ userName: user.user_id }, JWT_SECRET, {
			expiresIn: userExpirationTime,
		});
		res.status(200).json(success('User Session.', { token: jwtToken, role: "User" }));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function serviceInformation(req, res) {
	if (req.role == "expert"){
		if (!req.query.serviceId)
			return res.status(400).json(error("Missing parameter.", 400));
		let edu = await EducationalService.findOne({ where: { service_id: req.query.serviceId } });
		if (!edu)
			return res.status(404).json(error("Service not found.", 404));

		res.status(200).json(success("Educational Service Information", convService(edu)));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

module.exports = { newTicket, searchTicket, updateTicket, changeServiceState, getUserSession, serviceInformation };
