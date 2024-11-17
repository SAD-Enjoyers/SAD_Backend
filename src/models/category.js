const { DataTypes, Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Category = sequelize.define('Category', {
	category_id: {
		type: DataTypes.SMALLINT,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	category: {
		type: DataTypes.STRING(30),
		allowNull: false,
	},
},{
	timestamps: false,
	tableName: 'Category',
});

module.exports = { Category };