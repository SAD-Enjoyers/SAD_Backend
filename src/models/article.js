const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Article = sequelize.define('Article', {
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
	title: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	a_text: {
		type: DataTypes.TEXT,
		allowNull: false,
		// field: 'a_text', // Matches the column name in the database. (we can change from a_text to text or aText)
	},
	attachment: {
		type: DataTypes.STRING(255),
		allowNull: true,
	},
}, {
	tableName: 'Article',
	timestamps: false,
});

module.exports = { Article };
