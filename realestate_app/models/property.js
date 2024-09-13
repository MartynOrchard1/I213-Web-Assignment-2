const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importing Seq instance

const Property = sequelize.define('Property', {
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    suburb: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'properties', // Specify if diff from model name
    timestamps: false // Disable auto timestamps
});

module.exports = Property;