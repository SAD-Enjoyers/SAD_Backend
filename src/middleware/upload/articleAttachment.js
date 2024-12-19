const multer = require('multer');
const path = require('path');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const storageAddress = config.app.articleAttachment;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `./${storageAddress}`);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = ['application/pdf', 'application/zip', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type. Only PDF, DOCX, ZIP, and images are allowed.'));
	}
};

const articleAttachmentUploader = multer({ storage, fileFilter }).single('file');

module.exports = { articleAttachmentUploader };
