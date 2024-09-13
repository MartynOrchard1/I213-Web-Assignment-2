const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Suburb = sequelize.define('Suburb', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'suburbs',  // Ensure this matches your actual database table name
  timestamps: false      // Disable automatic timestamps if not needed
});

module.exports = Suburb;