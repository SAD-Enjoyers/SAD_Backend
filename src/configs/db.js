const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

function connectDB() {
	try {
		sequelize.authenticate();
		console.log('Database connected successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}


module.exports = { sequelize, connectDB };