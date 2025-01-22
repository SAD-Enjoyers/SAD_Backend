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

function convExamResult(result) {
	const passed = result.passed == 'P' ? "Passed" : "Rejected";
	let newResult = {
		examScore: result.exam_score,
		rightAnswers: result.right_answers,
		wrongAnswers: result.wrong_answers,
		emptyAnswers: result.empty_answers,
		passed,
	}
	return newResult;
}

function convParticipants(participants) {
	const newParticipants = participants.map((participant) => {
		const examResult = participant?.ExamResults[0] || null;
		return {
			userId: participant.user_id,
			firstName: participant.first_name,
			lastName: participant.last_name,
			image: participant.image,
			examResult: examResult ? {
				examScore: examResult.exam_score,
				passed: examResult.passed == 'P' ? "Passed" : "Rejected",
				rightAnswers: examResult.right_answers,
				wrongAnswers: examResult.wrong_answers,
				emptyAnswers: examResult.empty_answers,
			} : null,
			hasResult: !!examResult, // Flag indicating if the result exists
		};
	});
	return newParticipants;
}

function convArticle (article) {
	if ('A' == article.activity_status)
		article.activity_status = "Active";
	else if ('P' == article.activity_status)
		article.activity_status = "Passive";
	else
		article.activity_status = "Suspended";

	if ('1' == article.s_level)
		article.s_level = "Beginner";
	else if ('2' == article.s_level)
		article.s_level = "Medium";
	else
		article.s_level = "Advanced";

	let newArticle = {
		userId: article.user_id,
		serviceId: article.service_id,
		name: article.s_name,
		description: article.description,
		level: article.s_level,
		price: article.price,
		activityStatus: article.activity_status,
		score: article.score,
		numberOfVoters: article.number_of_voters,
		image: article.image,
		tag1: article.tag1,
		tag2: article.tag2,
		tag3: article.tag3,
		numberOfMembers: article.userCount,
	}
	return newArticle;
}

function convBlog(blog) {
	return { title: blog.title, text: blog.a_text, attachment: blog.attachment };
}

function convArticleCard(article){
	if ('1' == article.s_level)
		article.s_level = "Beginner";
	else if ('2' == article.s_level)
		article.s_level = "Medium";
	else
		article.s_level = "Advanced";

	let newArticle = {
		userId: article.user_id,
		serviceId: article.service_id,
		name: article.s_name,
		description: article.description,
		level: article.s_level,
		price: article.price,
		score: article.score,
		numberOfVoters: article.number_of_voters,
		image: article.image,
		tag1: article.tag1,
		tag2: article.tag2,
		tag3: article.tag3,
	}
	return newArticle;
}

function convTransaction(transaction) {
	let type = null;
	if (transaction.t_type == '1')
		type = 'Deposit';
	if (transaction.t_type == '2')
		type = 'Withdraw';
	if (transaction.t_type == '3')
		type = 'Buy service';
	if (transaction.t_type == '4')
		type = 'Sold service';

	return { time: transaction.t_time, type: type, volume: transaction.t_volume };
}

function convVideo(video) {
	let newVideo = {
		userId: video.user_id,
		serviceId: video.service_id,
		title: video.title,
		description: video.v_description,
		sortNumber: video.sort_number,
		address: video.address
	};
	return newVideo;
}

function convCourse(course) {
	if ('A' == course.activity_status)
		course.activity_status = "Active";
	else if ('P' == course.activity_status)
		course.activity_status = "Passive";
	else
		course.activity_status = "Suspended";

	if ('1' == course.s_level)
		course.s_level = "Beginner";
	else if ('2' == course.s_level)
		course.s_level = "Medium";
	else
		course.s_level = "Advanced";

	let newCourse = {
		userId: course.user_id,
		serviceId: course.service_id,
		name: course.s_name,
		description: course.description,
		level: course.s_level,
		price: course.price,
		activityStatus: course.activity_status,
		score: course.score,
		numberOfVoters: course.number_of_voters,
		image: course.image,
		tag1: course.tag1,
		tag2: course.tag2,
		tag3: course.tag3,
		numberOfMembers: course.userCount,
		numberOfVideos: course.videos,
	}
	return newCourse;
}

function convCourseCard(course) {
	if ('1' == course.s_level)
		course.s_level = "Beginner";
	else if ('2' == course.s_level)
		course.s_level = "Medium";
	else
		course.s_level = "Advanced";

	let newCourse = {
		userId: course.user_id,
		serviceId: course.service_id,
		name: course.s_name,
		description: course.description,
		level: course.s_level,
		price: course.price,
		score: course.score,
		numberOfVoters: course.number_of_voters,
		image: course.image,
		tag1: course.tag1,
		tag2: course.tag2,
		tag3: course.tag3,
	}
	return newCourse;
}

function convTicket(ticket) {
	if(ticket.t_state == 1)
		ticket.t_state = 'Pending';
	else if(ticket.t_state == 2)
		ticket.t_state = 'Under review';
	else 
		ticket.t_state = 'Checked';

	let newTicket = {
		ticketId: ticket.ticket_id,
		userId: ticket.user_id,
		serviceId: ticket.service_id,
		message: ticket.t_message,
		reportTime: ticket.report_time,
		state: ticket.t_state,
		answer: ticket.answer,
		expertId: ticket.expert_id
	}
	return newTicket;
}

module.exports = { convUser, convExpert, convCategory, convQuestion, convPreviewExam,
	convExam, convExamCard, convExamQuestions, convComment, 
	convExamResult, convParticipants, convArticle, convBlog,
	convArticleCard, convTransaction, convVideo, convCourse, convCourseCard,
	convTicket, };
