const admin = require('./admin');
const ticket = require('./ticket');
const statistics = require('./statistics');

module.exports = {
	...admin,
	...ticket,
	...statistics,
}
