const admin = require('./admin');
const ticket = require('./ticket');

module.exports = {
	...admin,
	...ticket,
}
