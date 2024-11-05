const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = require('../configs/db');

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
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  },
  service_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    primaryKey: true,
  },
  s_name: {
    type: DataTypes.STRING(70),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  s_level: {
    type: DataTypes.STRING(15),
    allowNull: false,
    defaultValue: 'Beginner',
    validate: {
      isIn: [['Beginner', 'Medium', 'Advanced']],
    },
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  service_type: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    validate: {
      isIn: [[1, 2, 3]],
    },
  },
  activity_status: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'P',
    validate: {
      isIn: [['A', 'S', 'P']],
    },
  },
  achieved_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  achieved_from: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING(250),
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'Educational_service',
});

module.exports = { EducationalService };