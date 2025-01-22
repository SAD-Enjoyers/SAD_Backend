const { Expert, Ticket } = require('../../models');
const { success, error, convExpert, hashPassword, convTicket } = require('../../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../../configs');
const { Op } = require('sequelize');

async function searchTicket(req, res) {
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
