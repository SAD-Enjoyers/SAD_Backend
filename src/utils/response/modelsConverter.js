const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const defaultProfileImage = config.app.defaultProfileImage;

function convUser (user) {
	let newUser = {
		userName : user.user_id,
		email : user.email,
		firstName : user.first_name || "Unknown",
		lastName : user.last_name || "Unknown",
		sex : user.sex !== null ? user.sex : "not specified",
		address : user.address || "Address not provided",
		birthDate : user.birth_date || "Unknown",
		description : user.description || "No description provided",
		phoneNumber : user.phone_number || "Not provided",
		image : user.image || defaultProfileImage,
		balance : user.balance || 0.0,
		cardNumber : user.card_number || "No card number",
	};
	return newUser;
}

function convExpert (expert) {
	let newExpert = {
		userName : expert.expert_id,
		firstName : expert.first_name,
		lastName : expert.last_name,
		phoneNumber : expert.phone_number,
		organizationalPosition : expert.organizational_position,
	};
	return newExpert;
}

module.exports = { convUser, convExpert };
