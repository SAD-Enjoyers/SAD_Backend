const { User, BackupUser, Expert } = require('../models');
const { success, error, hashPassword, verifyPassword,
	randomPassword, clearRecoveryCode, generateRandomToken } = require('../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../configs');
const jwt = require('jsonwebtoken');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const JWT_SECRET = process.env.JWT_SECRET;
const expireTime = parseInt(config.app.expireTime);
const domain = config.server.domain;
const userExpirationTime = config.server.userExpirationTime;
const expertExpirationTime = config.server.expertExpirationTime;
const name = config.app.name;
const baseRoute = 'api/v1'


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
	const verificationToken = await generateRandomToken();

	const verificationUrl = `http://${domain}/${baseRoute}/auth/verify-email?token=${verificationToken}&userName=${user_id}`;
	const mail = verifyMail(email, verificationUrl, domain, name);
	await transporter.sendMail(mail);

	const newUser = await User.create({ user_id, email, u_password: hashedPassword, verification_token: verificationToken});
	const newBackupUser = await BackupUser.create({ user_id, u_password });

	return res.status(201).json(success( 'User registered. Please check your email for verification.',
		{user: {
			userName: newUser.user_id,
			email: newUser.email,
		}}, 201));
}

async function verifyEmail (req, res) {
	const { token, userName } = req.query;

	const user = await User.findOne({ where: { user_id: userName, verification_token: token } });
	if (!user) {
		return res.status(400).send('Invalid or expired verification link');
	}

	user.verified = true;
	user.verification_token = null;
	await user.save();

	return res.redirect('/login');
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
			expiresIn: userExpirationTime,
		});
		Role = "user";
	} else {
		const isPasswordValid = await verifyPassword(req.body.userPassword, expert.e_password);
		if (!isPasswordValid) {
			return res.status(404).json(error('Username/Password is not valid.', 404));
		}
		jwtToken = jwt.sign({ userName: expert.user_id }, JWT_SECRET, {
			expiresIn: expertExpirationTime,
		});
		Role = "expert";
	}
	res.setHeader('x-token', jwtToken);
	res.setHeader('x-role', Role);
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

	const mail = forgotMail(email, recoveryCode, name);
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

	if(!userBackup || !userBackup.recovery_code || !userBackup.generated_time){
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

module.exports = { signupUser, login, sendForgotMail, verifyRecoveryCode, verifyEmail };
