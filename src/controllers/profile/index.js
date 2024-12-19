const privateServices = require('./privateServices');
const privateProfile = require('./privateProfile');
const wallet = require('./wallet');

module.exports = {
	...privateProfile,
	...privateServices,
	...wallet,
};
