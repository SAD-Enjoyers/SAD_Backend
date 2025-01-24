const { Expert } = require('../../models');
const { success, error, convExpert, hashPassword } = require('../../utils');

async function editExpert(req, res){
	if (req.role == 'expert'){
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

		res.status(200).json(success('Profile updated successfully.', convExpert(expert)));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function newAdmin(req, res) {
	if (req.role == 'expert'){
		if (!req.body.expertId || !req.body.password || !req.body.firstName || !req.body.lastName || !req.body.phoneNumber)
			return res.status(400).json(error('Missing parameter.', 400));
		let expert = await Expert.findByPk(req.body.expertId);
		if (expert)
			return res.status(403).json(error('There is an expert with same expertId.', 403));

		expert = await Expert.create({ expert_id: req.body.expertId, first_name: req.body.firstName,
			last_name: req.body.lastName, phone_number: req.body.phoneNumber,
			e_password: await hashPassword(req.body.password) });

		res.status(201).json(success('Expert created successfully.', convExpert(expert)));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

module.exports = { editExpert, newAdmin };
