const privateServices = require('./privateServices');
const privateProfile = require('./privateProfile');

module.exports = {
	...privateProfile,
	...privateServices,
};
