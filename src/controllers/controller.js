const { User, BackupUser } = require('../models/user');
const { success, error } = require('../utils/responseFormatter');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const logger = require('../configs/logger');

async function signupUser(req, res) {
	const user_id = req.body.userName;
	const email = req.body.email;
	const u_password = req.body.userPassword;

	const existingUser = await User.findOne({ where: { user_id } });
	const existingEmail = await User.findOne({ where: { email } });

	if (existingUser || existingEmail) {
		return res.status(409)
			.json(error("User with this username or email already exists.", 409));
	}

	const hashedPassword = await hashPassword(u_password);

	const newUser = await User.create({ user_id, email, u_password: hashedPassword, });
	res.status(201).json(success( 'User created successfully.',
		{user: {
			userId: newUser.user_id,
			email: newUser.email,
		}}, 201));
}


module.exports = { signupUser };
