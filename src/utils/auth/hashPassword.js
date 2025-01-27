const bcrypt = require('bcrypt');

async function hashPassword(password) {
	const salt = await bcrypt.genSalt(9);
	return bcrypt.hash(password, salt);
}

async function verifyPassword(password, hash) {
	return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, verifyPassword };
