const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../configs/db');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const User = sequelize.define('User', {
	user_id: {
		type: DataTypes.STRING(30),
		primaryKey: true,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING(150),
		allowNull: false,
		unique: true,
	},
	u_password: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	first_name: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	last_name: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	sex: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
	address: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	birth_date: {
		type: DataTypes.DATEONLY,
		allowNull: true,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	phone_number: {
		type: DataTypes.STRING(14),
		allowNull: true,
	},
	image: {
		type: DataTypes.STRING(250),
		allowNull: true,
	},
	balance: {
		type: DataTypes.DECIMAL(12, 2),
		allowNull: true,
	},
	card_number: {
		type: DataTypes.CHAR(16),
		allowNull: true,
	},
	verified: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	verification_token: {
		type: DataTypes.STRING,
		allowNull: true,
	}
}, {
	tableName: 'User',
	timestamps: false,
	// automatically add createdAt and updatedAt columns to table 
	// and update them from backend
});

const BackupUser = sequelize.define('BackupUser', {
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		primaryKey: true,
		references: {
			model: User,
			key: 'user_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
	},
	u_password: {
		type: DataTypes.STRING(100),
		allowNull: false,
		comment: 'plain password',
	},
	recovery_code: {
		type: DataTypes.STRING(100),
		allowNull: true,
	},
	generated_time: {
		type: DataTypes.BIGINT, // Use BIGINT for Unix timestamps in milliseconds
		allowNull: true,
	}
}, {
	tableName: 'Backup_user',
	timestamps: false,
});

const Transaction = sequelize.define('Transaction', {
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		primaryKey: true,
		references: {
			model: 'User',
			key: 'user_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'CASCADE',
	},
	t_time: {
		type: DataTypes.DATE,
		primaryKey: true,
		allowNull: false,
		// field: 't_time',
	},
	t_type: {
		type: DataTypes.CHAR(1),
		allowNull: false,
		comment: '1: deposit, 2: withdraw, 3: buy service, 4: sold service',
	},
	t_volume: {
		type: DataTypes.DECIMAL(12, 2),
		allowNull: false,
	},
}, {
	tableName: 'Transaction',
	timestamps: false,
});


module.exports = { User, BackupUser, Transaction };
