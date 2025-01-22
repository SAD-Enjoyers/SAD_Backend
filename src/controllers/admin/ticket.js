const { Expert, Ticket } = require('../../models');
const { success, error, convExpert, hashPassword, convTicket } = require('../../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../../configs');
const { Op } = require('sequelize');

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

module.exports = { newTicket, searchTicket };
