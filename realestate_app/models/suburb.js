const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import the Seq instance

const Suburb = sequelize.define('Suburb', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'suburbs',   // Adjust according to your actual table name
  timestamps: false       // Disable automatic timestamps
});

module.exports = Suburb;
