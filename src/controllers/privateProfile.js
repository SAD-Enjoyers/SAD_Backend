const { User, BackupUser, Expert } = require('../models');
const { success, error, hashPassword, verifyPassword,
	randomPassword, clearRecoveryCode, generateRandomToken, 
	convUser, convExpert } = require('../utils');
const { logger, transporter, createMail, forgotMail, verifyMail } = require('../configs');
const jwt = require('jsonwebtoken');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const JWT_SECRET = process.env.JWT_SECRET;
const expireTime = parseInt(config.app.expireTime);
const domain = config.server.domain;
const name = config.app.name;
const baseRoute = 'api/v1'

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

module.exports = { getPrivateProfile };
