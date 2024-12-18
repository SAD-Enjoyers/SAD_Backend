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

function convPreviewExam (exam) {
	if ('1' == exam.s_level)
		exam.s_level = "Beginner";
	else if ('2' == exam.s_level)
		exam.s_level = "Medium";
	else
		exam.s_level = "Advanced";

	let newExam = {
		userId: exam.user_id,
		serviceId: exam.service_id,
		name: exam.s_name,
		description: exam.description,
		level: exam.s_level,
		price: exam.price,
		score: exam.score,
		numberOfVoters: exam.number_of_voters,
		image: exam.image,
		tag1: exam.tag1,
		tag2: exam.tag2,
		tag3: exam.tag3,
		numberOfMembers: exam.userCount,
		examDuration: exam.exam_duration,
		minPassScore: exam.min_pass_score,
		numberOfQuestion: exam.questionCount
	}
	return newExam;
}

function convExam (exam) {
	if ('A' == exam.activity_status)
		exam.activity_status = "Active";
	else if ('P' == exam.activity_status)
		exam.activity_status = "Passive";
	else
		exam.activity_status = "Suspended";

	if ('1' == exam.s_level)
		exam.s_level = "Beginner";
	else if ('2' == exam.s_level)
		exam.s_level = "Medium";
	else
		exam.s_level = "Advanced";

	let newExam = {
		userId: exam.user_id,
		serviceId: exam.service_id,
		name: exam.s_name,
		description: exam.description,
		level: exam.s_level,
		price: exam.price,
		activityStatus: exam.activity_status,
		score: exam.score,
		numberOfVoters: exam.number_of_voters,
		image: exam.image,
		tag1: exam.tag1,
		tag2: exam.tag2,
		tag3: exam.tag3,
		examDuration: exam.exam_duration,
		minPassScore: exam.min_pass_score,
		numberOfMembers: exam.userCount,
		numberOfQuestion: exam.questionCount
	}
	return newExam;
}

function convExamQuestions(question) {
	let newQuestion = {
		questionId: question.question_id,
		userName: question.user_id,
		questionName: question.question_name,
		questionText: question.question_text,
		o1: question.o1,
		o2: question.o2,
		o3: question.o3,
		o4: question.o4,
		tag1: question.tag1,
		tag2: question.tag2,
		tag3: question.tag3,
		score: question.score,
		numberOfVoters: question.number_of_voters,
	};
	return newQuestion;
}

function convExamCard(exam){
	if ('1' == exam.s_level)
		exam.s_level = "Beginner";
	else if ('2' == exam.s_level)
		exam.s_level = "Medium";
	else
		exam.s_level = "Advanced";

	let newExam = {
		userId: exam.user_id,
		serviceId: exam.service_id,
		name: exam.s_name,
		description: exam.description,
		level: exam.s_level,
		price: exam.price,
		score: exam.score,
		numberOfVoters: exam.number_of_voters,
		image: exam.image,
		tag1: exam.tag1,
		tag2: exam.tag2,
		tag3: exam.tag3,
	}
	return newExam;
}

function convComment(comment) {
	let newComment = {
		userId: comment.user_id,
		serviceId: comment.service_id,
		commentId: comment.comment_id,
		parentComment: comment.parent_comment,
		text: comment.c_text,
		date: comment.c_date,
	}
	return newComment;
}

module.exports = { convUser, convExpert, convCategory, convQuestion, convPreviewExam,
	convExam, convExamCard, convExamQuestions, convComment };
