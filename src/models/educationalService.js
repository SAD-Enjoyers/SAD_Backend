const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const EducationalService = sequelize.define('EducationalService', {
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
	service_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
	s_name: {
		type: DataTypes.STRING(150),
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	s_level: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		validate: {
			isIn: [['1', '2', '3']], // 1: Beginner, 2: Medium, 3: Advanced
		},
	},
	price: {
		type: DataTypes.DECIMAL(6, 2), // Matches NUMERIC(6, 2)
		defaultValue: 0.0,
	},
	service_type: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		validate: {
			isIn: [['1', '2', '3']], // 1: Exam, 2: Article, 3: Video
		},
	},
	activity_status: {
		type: DataTypes.CHAR(1),
		defaultValue: 'P', // A: Active, S: Suspended, P: Passive
		validate: {
			isIn: [['A', 'S', 'P']],
		},
	},
	score: {
		type: DataTypes.DECIMAL(3, 2),
		allowNull: false,
		defaultValue: 0.0,
	},
	number_of_voters: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		defaultValue: 0,
	},
	image: {
		type: DataTypes.STRING(250),
		allowNull: true,
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
	tableName: 'Educational_service',
	timestamps: false,
});

const ServiceRecordedScores = sequelize.define('ServiceRecordedScores', {
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
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		references: {
			model: 'User',
			key: 'user_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
		primaryKey: true,
	},
	score: {
		type: DataTypes.DECIMAL(3, 2),
		allowNull: false,
	},
}, {
	tableName: 'Service_recorded_scores',
	timestamps: false,
});

const Registers = sequelize.define('Registers', {
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
}, {
	tableName: 'Registers',
	timestamps: false,
});

const Comment = sequelize.define('Comment', {
	comment_id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true,
		unique: true,
		field: 'comment_id',
	},
	parent_comment: {
		type: DataTypes.BIGINT,
		allowNull: true,
		field: 'parent_comment',
		references: {
			model: 'Comment',
			key: 'comment_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		field: 'service_id',
		references: {
			model: 'Educational_service',
			key: 'service_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
	},
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		field: 'user_id',
		references: {
			model: 'User',
			key: 'user_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	c_text: {
		type: DataTypes.TEXT,
		allowNull: false,
		field: 'c_text',
		comment: 'Text of the comment',
	},
	c_date: {
		type: DataTypes.DATE,
		allowNull: false,
		field: 'c_date',
		comment: 'Date the comment was created',
	},
}, {
	tableName: 'Comment',
	timestamps: false,
});

module.exports = { EducationalService, ServiceRecordedScores, Registers, Comment };
