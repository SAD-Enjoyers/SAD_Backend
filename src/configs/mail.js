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

module.exports = { transporter, createMail };
