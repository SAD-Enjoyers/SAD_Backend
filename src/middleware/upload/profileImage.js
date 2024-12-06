const multer = require('multer');
const path = require('path');
const ini = require('ini');
const fs = require('fs');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const storageAddress = config.app.profileImage;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, `./${storageAddress}`);
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const profileImageUploader = multer({ storage }).single('image');

module.exports = { profileImageUploader };
