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
const name = config.app.name;
const baseRoute = 'api/v1'

async function getPrivateProfile (req, res) {
	return res.send('ok');
}

module.exports = { getPrivateProfile };
