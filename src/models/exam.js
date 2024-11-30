const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Exam = sequelize.define('Exam', {
	serviceId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
		primaryKey: true,
		references: {
			model: 'Educational_service',
			key: 'service_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	exam_duration: {
		type: DataTypes.INTEGER,
		allowNull: false,
		comment: 'Duration of the exam in minutes',
	},
	min_pass_score: {
		type: DataTypes.INTEGER,
		allowNull: false,
		comment: 'Minimum score required to pass the exam',
	},
}, {
	tableName: 'Exam',
	timestamps: false, 
});

module.exports = { Exam };
