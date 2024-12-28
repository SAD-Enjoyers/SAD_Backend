const { EducationalService, Registers, Video } = require('../../models');
const { success, error, convCourse } = require('../../utils');
const { sequelize } = require('../../configs');

async function courses(req, res) {
	// body...
}

async function preview(req, res) {
	let edu = await EducationalService.findOne({ where: { service_id: req.params.serviceId, service_type: "3" } });
	if (!edu || (! edu.activity_status == 'A'))
		return res.status(404).json(error('Service not found.', 404));
	const videos = await Video.count({ where: { service_id: req.params.serviceId } });
	const userCount = await Registers.count({ where: { service_id: req.params.serviceId } });

	edu = convCourse({ ...edu.dataValues, userCount, videos });

	let privatePage = false;
	if (req.userName){
		// it can be optimize by first check edu.user_id
		const registered = await Registers.findOne({ where: { service_id: req.params.serviceId, user_id: req.userName } });
		if (req.userName == edu.userId || registered)
			privatePage = true;
	}

	res.status(200).json(success('Course', { Course: edu, privatePage }));
}


module.exports = {
	courses, preview,
};
