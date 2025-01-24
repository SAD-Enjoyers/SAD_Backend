const { Expert, Activity, EducationalService } = require('../../models');
const { success, error, convExpert } = require('../../utils');
const { sequelize } =require('../../configs');
const { Op } = require('sequelize');

async function serviceStatistics(req, res) {
	if (req.role = "expert"){
		let stats_t = await EducationalService.findAll({
			attributes: [ 'service_type', [sequelize.fn('COUNT', sequelize.col('service_id')), 'count'], ],
			group: ['service_type'], raw: true,
		});

		let stats_a = await EducationalService.findAll({
			attributes: [ 'activity_status', [sequelize.fn('COUNT', sequelize.col('service_id')), 'count'], ],
			group: ['activity_status'], raw: true,
		});

		let stats_l = await EducationalService.findAll({
			attributes: [ 's_level', [sequelize.fn('COUNT', sequelize.col('service_id')), 'count'], ],
			group: ['s_level'], raw: true,
		});

		let totalService = 0;
		stats_t.map((item) => {totalService += parseInt(item.count) });

		stats_t = stats_t.reduce((acc, item) => {
			if (item.service_type == '1')
				acc.Exam = item.count;
			else if (item.service_type == '2')
				acc.Article = item.count;
			else
				acc.Video = item.count;
			return acc;
		}, {});

		stats_a = stats_a.reduce((acc, item) => {
			if (item.activity_status == 'A')
				acc.Active = item.count;
			else if (item.activity_status == 'P')
				acc.Passive = item.count;
			else
				acc.Suspended = item.count;
			return acc;
		}, {});


		stats_l = stats_l.reduce((acc, item) => {
			if (item.s_level == '1')
				acc.Beginner = item.count;
			else if (item.s_level == '2')
				acc.Medium = item.count;
			else
				acc.Advanced = item.count;
			return acc;
		}, {});

		res.status(200).json(success('Educational service statistics', 
			{ total: totalService, serviceType: stats_t, activityStatus: stats_a, level: stats_l }));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

module.exports = { serviceStatistics };
