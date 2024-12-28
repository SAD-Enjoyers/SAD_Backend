const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Video = sequelize.define('Video', {
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Educational_service',
			key: 'service_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		// field: 'service_id',
	},
	video_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		unique: true,
		// field: 'video_id',
	},
	title: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	v_description: {
		type: DataTypes.TEXT,
		allowNull: true,
		// field: 'v_description',
	},
	sort_number: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		// field: 'sort_number',
	},
	address: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	v_time: {
		type: DataTypes.TIME,
		allowNull: true,
		// field: 'v_time',
	},
}, {
	tableName: 'Video',
	timestamps: false,
});

module.exports = { Video };
