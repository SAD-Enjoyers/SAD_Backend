const multer = require('multer');
const path = require('path');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const storageAddress = config.app.courseVideo;

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
	const allowedTypes = ['video/mp4', 'video/x-matroska'];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type. Only MP4 and MKV are allowed.'));
	}
};

const courseVideoUploader = multer({ storage, fileFilter }).single('file');

module.exports = { courseVideoUploader };
