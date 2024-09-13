const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importing Seq instance
const Suburb = require('./suburb');

const Property = sequelize.define('Property', {
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    suburb_id: {  // Ensure this is `suburb_id`, not `suburb`
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'properties',  // Ensure this matches your actual database table name
    timestamps: false         // Disable automatic timestamps if not needed
  });
  
  // Define the association between Property and Suburb
  Property.belongsTo(Suburb, { foreignKey: 'suburb_id' });  // Link property to suburb
  
  module.exports = Property;