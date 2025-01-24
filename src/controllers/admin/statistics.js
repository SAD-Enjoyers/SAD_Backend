const { Expert, Activity, EducationalService, Ticket } = require('../../models');
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

async function ticketStatistics(req, res) {
	if (req.role == "expert"){
		const results = await Ticket.findAll({
			attributes: [
				't_state',
				[Ticket.sequelize.fn('COUNT', Ticket.sequelize.col('ticket_id')), 'count'],
			],
			group: ['t_state'],
		});

		const stats = results.reduce(
			(acc, row) => {
				const { t_state, count } = row.get({ plain: true });
				switch (t_state) {
					case 1:
						acc.pending += parseInt(count, 10);
						break;
					case 2:
						acc.UnderReview += parseInt(count, 10);
						break;
					case 3:
						acc.Checked += parseInt(count, 10);
						break;
					default:
						break;
				}
				acc.total += parseInt(count, 10);
				return acc;
			},
			{ total: 0, pending: 0, UnderReview: 0, Checked: 0 }
		);

		res.status(200).json(success("Ticket statistics", stats));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

async function userActivityStatistics(req, res) {
	if (req.role = "expert"){
		let days = req.query.days;
		if (!days)
			return res.status(400).json(error('Missing parameter.', 400));

		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		startDate.setHours(0, 0, 0, 0);

		const results = await Activity.findAll({
			attributes: [
				[Activity.sequelize.fn('DATE', Activity.sequelize.col('l_time')), 'login_date'],
				[Activity.sequelize.fn('COUNT', Activity.sequelize.fn('DISTINCT', Activity.sequelize.col('user_id'))), 'user_count'],
			],
			where: {
				l_time: {
					[Op.gte]: startDate,
				},
			},
			group: [Activity.sequelize.fn('DATE', Activity.sequelize.col('l_time'))],
			order: [[Activity.sequelize.fn('DATE', Activity.sequelize.col('l_time')), 'ASC']],
		});

		const userActivity = results.map(row => {
			const { login_date, user_count } = row.get({ plain: true });
			return { [login_date]: parseInt(user_count, 10) };
		});

		res.status(200).json(success('User activity:', userActivity));
	} else 
		return res.status(403).json(error('Access denied.', 403));
}

module.exports = { serviceStatistics, ticketStatistics, userActivityStatistics };
