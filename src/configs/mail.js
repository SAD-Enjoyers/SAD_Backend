const nodemailer = require('nodemailer');
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: EMAIL,
		pass: EMAIL_PASSWORD
	}
});

function createMail (dis, title= 'Information Email from TechVerse.', message= 'Welcome to TechVerse.') {
	return {
		from: EMAIL,
		to: dis,
		subject: title,
		text: message
	};
}

function forgotMail (dis, code) {
	const title= 'TechVerse. Account Recovery Code';
	const message= `	Hello,

	We received a request to reset the password for your account. Please use the recovery code below to complete the process.
	If you did not request a password reset, please ignore this email.

		**Your Recovery Code:** ${code}

	For your security, this code will expire in 15 minutes. Please do not share it with anyone.

	Thank you,
	The TechVerse Team`;
	return {
		from: EMAIL,
		to: dis,
		subject: title,
		text: message
	};
}

module.exports = { transporter, createMail, forgotMail };
