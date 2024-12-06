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

const ExamResult = sequelize.define('ExamResult', {
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Educational_service',
			key: 'service_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		references: {
			model: 'User',
			key: 'user_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
		primaryKey: true,
	},
	participation_times: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		comment: 'Number of times the user participated in the exam',
	},
	start_time: {
		type: DataTypes.DATE,
		allowNull: true,
		comment: 'Start time of the exam',
	},
	exam_score: {
		type: DataTypes.SMALLINT,
		allowNull: true,
		comment: 'Score the user achieved in the exam',
	},
	passed: {
		type: DataTypes.CHAR(1),
		allowNull: true,
		comment: 'Indicates if the user passed the exam (Y/N)',
	},
	right_answers: {
		type: DataTypes.SMALLINT,
		allowNull: true,
		comment: 'Number of correct answers',
	},
	wrong_answers: {
		type: DataTypes.SMALLINT,
		allowNull: true,
		comment: 'Number of incorrect answers',
	},
	empty_answers: {
		type: DataTypes.SMALLINT,
		allowNull: true,
		comment: 'Number of unanswered questions',
	},
}, {
	tableName: 'Exam_result',
	timestamps: false,
});

module.exports = { Exam, SelectedQuestions, ExamResult };
