const crypto = require('crypto');

function generateRandomToken(length = 100) {
	return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

module.exports = { generateRandomToken }
