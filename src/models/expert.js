const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../configs/db');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	logging: false,
});

const Expert = sequelize.define('Expert', {
  expert_id: {
    type: DataTypes.STRING(30),
    allowNull: false,
    primaryKey: true,
  },
  e_password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(14),
    allowNull: false,
  },
  organizational_position: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'S',
    validate: {
      isIn: [['E', 'S', 'M']],
    },
  },
}, {
  timestamps: false,
  tableName: 'Expert',
});

module.exports = { Expert };
