const ini = require('ini');
const fs = require('fs');
const { User, BackupUser } = require('../models/user');
const { Expert } = require('../models/expert');
const { success, error } = require('../utils/responseFormatter');
const { hashPassword, verifyPassword } = require('../utils/hashPassword');
const { randomPassword } = require('../utils/randomPassword');
const logger = require('../configs/logger');
const { clearRecoveryCode } = require('../utils/clearRecoveryCode');
const { generateRandomToken } = require('../utils/tokenGenerator');
const { transporter, createMail, forgotMail } = require('../configs/mail');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const expireTime = parseInt(config.app.expireTime);

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
	const newBackupUser = await BackupUser.create({ user_id, u_password });
	res.status(201).json(success( 'User created successfully.',
		{user: {
			userName: newUser.user_id,
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
		if (user && expert){
			logger.critical(`Critical: ${req.method}, ${req.url}: \nThere is a User with User_id of Admin. Login failed...(Contact DBA)\n`);
			return res.status(404).json(error('Username/Password is not valid.', 404));
		} else {
			return res.status(404).json(error('Username/Password is not valid.', 404));
		}
	}
	if (user){
		if (!user.verified) {
			return res.status(403).json(error('Please verify your email to log in', 403));
		}
	}

	let jwtToken = "placeholder";
	let Role = "placeholder";
	if(user){
		const isPasswordValid = await verifyPassword(req.body.userPassword, user.u_password);
		if (!isPasswordValid) {
			return res.status(404).json(error('Username/Password is not valid.', 404)); // 401 have security issue so use 404
		}
		jwtToken = jwt.sign({ userName: user.user_id }, JWT_SECRET, {
			expiresIn: '2h',
		});
		Role = "user";
	} else {
		const isPasswordValid = await verifyPassword(req.body.userPassword, expert.e_password);
		if (!isPasswordValid) {
			return res.status(404).json(error('Username/Password is not valid.', 404));
		}
		jwtToken = jwt.sign({ userName: expert.user_id }, JWT_SECRET, {
			expiresIn: '1h',
		});
		Role = "expert";
	}

	res.status(201).json(success('Login successful.', { token: jwtToken, role: Role }));
}


async function sendForgotMail(req, res) {
	const email = req.body.email;

	const user = await User.findOne({ where: { email } });
	if(!user || !user.verified){ 
		return res.status(404).json(error('Email is not valid.', 404));
	}

	let user_id = user.user_id;
	const userBackup = await BackupUser.findOne({ where: { user_id } });
	const recoveryCode = randomPassword();

	const mail = forgotMail(email, recoveryCode);
	await transporter.sendMail(mail);

	userBackup.recovery_code = recoveryCode;
	userBackup.generated_time = Date.now();
	await userBackup.save();

	res.status(250).json(success('The recovery code has been sent to your email.', { user_id, email })); 
	return setTimeout(clearRecoveryCode, expireTime, userBackup);
}

async function verifyRecoveryCode (req, res) {
	const email = req.body.email;
	const user_id = req.body.user_id;
	const recoveryCode = req.body.recoveryCode;
	const newPassword = req.body.newPassword;
	const now = Date.now();
	const userBackup = await BackupUser.findOne({ where: { user_id } });

	if(!userBackup || !userBackup.recovery_code || !userBackup.generated_time){ // bad handling
		return res.status(400).json(error('User Not Found.', 400));
	}
	if(now >= parseInt(userBackup.generated_time) + expireTime){
		return res.status(403).json(error('Recovery Code has been expired.', 403));
	}
	if(userBackup.recovery_code != recoveryCode){
		return res.status(400).json(error('Recovery Code is not valid.', 400));
	} else {
		const user = await User.findOne({ where: { user_id } });
		// there is no need for user validation
		const hashedPassword = await hashPassword(newPassword);
		user.u_password = hashedPassword;
		userBackup.u_password = newPassword;
		userBackup.recovery_code = null;
		await user.save();
		await userBackup.save();

		return res.status(200).json(success('Password has been changed.', { user_id, email }));
	}

}

module.exports = { signupUser, login, sendForgotMail, verifyRecoveryCode };
