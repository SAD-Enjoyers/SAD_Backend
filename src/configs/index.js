const db = require('./db');
const logger = require('./logger');
const mail = require('./mail');

module.exports = {
	...db,
	logger,
	...mail
};