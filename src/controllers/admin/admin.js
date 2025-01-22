const { Expert } = require('../../models');
const { success, error, convExpert, hashPassword } = require('../../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../../configs');

async function editExpert(req, res){
	const expert = await Expert.findByPk(req.userName);
	if (!expert) {
		return res.status(404).json({ message: 'Expert not found.' });
	}

	const allowedFields = ['first_name', 'last_name', 'phone_number', 'e_password'];
	const fields = [ 'firstName', 'lastName', 'phoneNumber', 'password'];

	const updates = {};
	for (let i = 0; i < fields.length; i++) {
		if (req.body[fields[i]] !== undefined) {
			if(i == 3){
				req.body[fields[i]] = await hashPassword(req.body[fields[i]]);
			}
			updates[allowedFields[i]] = req.body[fields[i]];
		}
	}
	await expert.update(updates);

	res.status(200).json(success('Profile updated successfully.', convExpert(expert) ));
}

module.exports = { editExpert };
