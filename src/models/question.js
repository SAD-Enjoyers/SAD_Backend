const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Question = sequelize.define('Question', {
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		references: {
			model: 'User',
			key: 'user_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
	},
	question_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	question_name: {
		type: DataTypes.STRING(50),
		allowNull: false,
	},
	question_text: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	o1: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	o2: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	o3: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	o4: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	right_answer: {
		type: DataTypes.SMALLINT,
		allowNull: false,
	},
	score: {
		type: DataTypes.DECIMAL(3, 2),
		defaultValue: 0.0,
	},
	number_of_voters: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		defaultValue: 0,
	},
	visibility: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	},
	tag1: {
		type: DataTypes.STRING(30),
		allowNull: true,
	},
	tag2: {
		type: DataTypes.STRING(30),
		allowNull: true,
	},
	tag3: {
		type: DataTypes.STRING(30),
		allowNull: true,
	},
}, {
	timestamps: false,
	tableName: 'Question',
});

module.exports = { Question };
