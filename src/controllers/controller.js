const { User, BackupUser } = require('../models/user');
const { Expert } = require('../models/expert');
const { success, error } = require('../utils/responseFormatter');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const logger = require('../configs/logger');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

async function signupUser(req, res) {
	const user_id = req.body.userName;
	const email = req.body.email;
	const u_password = req.body.userPassword;

	const existingUser = await User.findOne({ where: { user_id } });
	const existingExpert = await Expert.findOne({ where: { expert_id: user_id } });
	const existingEmail = await User.findOne({ where: { email } });

	if (existingUser || existingEmail || existingExpert) {
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

async function login(req, res) {
	const user_id = req.body.userName;
	const u_password = req.body.userPassword;
	const expert_id = req.body.userName;
	const e_password = req.body.userPassword;

	const user = await User.findOne({ where: { user_id } });
	const expert = await Expert.findOne({ where: { expert_id } });
	if ((!user && !expert) || (user && expert)) {
		return res.status(404).json(error('Username/Password is not valid.', 404));
		// To Do:
		// 	there is a user with same username of expert
		// 	handle it.
	}

	let jwtToken = "placeholder";
	if(user){
		const isPasswordValid = await verifyPassword(req.body.userPassword, user.u_password);
		if (!isPasswordValid) {
			return res.status(404).json(error('Username/Password is not valid.', 404)); // 401 have security issue so use 404
		}
		jwtToken = jwt.sign({ userName: user.user_id }, JWT_SECRET, {
			expiresIn: '2h',
		});
	} else {
		const isPasswordValid = await verifyPassword(req.body.userPassword, expert.e_password);
		if (!isPasswordValid) {
			return res.status(404).json(error('Username/Password is not valid.', 404));
		}
		jwtToken = jwt.sign({ userName: expert.user_id }, JWT_SECRET, {
			expiresIn: '1h',
		});
	}

	res.status(201).json(success('Login successful.', { token: jwtToken }));
}

module.exports = { signupUser, login };
