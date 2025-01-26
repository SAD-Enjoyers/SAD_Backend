const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Ticket = sequelize.define('Ticket', {
	ticket_id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
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
	},
	service_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'Educational_service',
			key: 'service_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	t_message: {
		type: DataTypes.TEXT,
		allowNull: false,
	},
	report_time: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	t_state: {
		type: DataTypes.SMALLINT,
		allowNull: false,
		comment: '1: pending, 2: Checked',
	},
	answer: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	expert_id: {
		type: DataTypes.STRING(30),
		allowNull: true,
		references: {
			model: 'Expert',
			key: 'expert_id',
		},
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION',
	},
}, {
	tableName: 'Ticket',
	timestamps: false, 
});

const NotifyUser = sequelize.define('NotifyUser', {
	user_id: {
		type: DataTypes.STRING(30),
		allowNull: false,
		primaryKey: true,
		references: {
			model: 'User',
			key: 'user_id',
		},
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	},
	state: {
		type: DataTypes.SMALLINT,
		allowNull: false,
	}
}, {
	tableName: 'Notify_user',
	timestamps: false, 
});

module.exports = { Ticket, NotifyUser };
