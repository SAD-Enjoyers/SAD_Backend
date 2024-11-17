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

function convCategory (category) {
	let newcategory = [];
	for (let i = 0; i < category.length; i++) {
		newcategory.push({ categoryId: category[i].category_id, category: category[i].category });
	}
	return newcategory;
}

function convQuestion (question) {
	let newQuestion = {
		questionId: question.question_id,
		userName: question.user_id,
		questionName: question.question_name,
		questionText: question.question_text,
		o1: question.o1,
		o2: question.o2,
		o3: question.o3,
		o4: question.o4,
		rightAnswer: question.right_answer,
		visibility: question.visibility,
		tag1: question.tag1,
		tag2: question.tag2,
		tag3: question.tag3,
		score: question.score,
		numberOfVoters: question.number_of_voters,
	};
	return newQuestion;
}

module.exports = { convUser, convExpert, convCategory, convQuestion };
