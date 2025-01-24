const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Activity = sequelize.define('Activity', {
	l_time: {
		type: DataTypes.DATE,
		allowNull: false,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		primaryKey: true,
	},
},{
	timestamps: false,
	tableName: 'Activity',
});

module.exports = { Activity };
