const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Exam = sequelize.define('Exam', {
	service_id: {
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

const SelectedQuestions = sequelize.define('SelectedQuestions', {
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Educational_service',
			key: 'service_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		primaryKey: true,
	},
	question_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Question',
			key: 'question_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		primaryKey: true,
	},
	sort_number: {
		type: DataTypes.SMALLINT,
		allowNull: true,
		comment: 'Defines the order of the questions in the service',
	},
}, {
	tableName: 'Selected_question',
	timestamps: false,
});

module.exports = { Exam, SelectedQuestions };
