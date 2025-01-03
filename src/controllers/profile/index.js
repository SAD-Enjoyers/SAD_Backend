const privateServices = require('./privateServices');
const privateProfile = require('./privateProfile');
const publicProfile = require('./publicProfile');
const wallet = require('./wallet');

module.exports = {
	...privateProfile,
	...privateServices,
	...wallet,
	...publicProfile,
};
