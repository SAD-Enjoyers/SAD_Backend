const { User, BackupUser, Expert, Ticket, NotifyUser } = require('../../models');
const { success, error, convUser, convExpert, convTicket } = require('../../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../../configs');

async function getPrivateProfile (req, res) {
	if (req.role == "user"){
		const user = await User.findOne({ where: { user_id: req.userName } });
		if (!user) {
			return res.status(404).json(error('User not found.', 404));
		}
		let userData = convUser(user);
		return res.status(200).json(success('User Profile:', { userData } ))

	} else if (req.role == "expert") {
		const expert = await Expert.findOne({ where: { expert_id: req.userName } });
		if (!expert) {
			return res.status(404).json(error('User not found.', 404));
		}
		let expertData = convExpert(expert);
		return res.status(200).json(success('Expert Profile:', { expertData } ))

	} else {
		return res.status(404).json(error('User not found.', 404));
	}
}

async function editProfile(req, res) {
	const user = await User.findByPk(req.userName);
	if (!user) {
		return res.status(404).json({ message: 'User not found.' });
	}

	if (user.user_id != req.body.userId){
		const exist = await User.findByPk(req.body.userId); 
		if (exist)
			return res.status(400).json(error('This UserID has already been used.', 400));
	}

	const allowedFields = [
		'user_id', 'first_name', 'last_name', 'sex', 'address',
		'birth_date', 'description', 'phone_number', 'image',
	];
	const fields = [
		'userId', 'firstName', 'lastName', 'sex', 'address',
		'birthDate', 'description', 'phoneNumber', 'image',
	];

	const updates = {};
	for (let i = 0; i < fields.length; i++) {
		if (req.body[fields[i]] !== undefined) {
			updates[allowedFields[i]] = req.body[fields[i]];
		}
	}
	await user.update(updates);

	res.status(200).json(success('Profile updated successfully.', convUser(user) ));
}

async function userTickets(req, res) {
	let tickets = await Ticket.findAll({ where: { user_id: req.userName }, order: [['report_time', 'DESC']], });
	if(!tickets || !tickets.length)
		return res.status(200).json(success('No Ticket available.', {}));

	tickets = tickets.map((item) => ({ ...convTicket(item) }));
	return res.status(200).json(success('Tickets:', tickets));
}

async function ticketNotify(req, res){
	let notify = await NotifyUser.findOne({ where: { user_id: req.userName } });
	if(notify && notify.state == 1){
		await notify.update({ state: 0 });
		res.status(200).json(success("Notify User", { status: true }));
	}
	else
		res.status(200).json(success("Notify User", { status: false }));
}

module.exports = { getPrivateProfile, editProfile, userTickets, ticketNotify };
