const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Property = sequelize.define('Property', {
    address: { type: DataTypes.STRING, allowNull: false },
    suburb: { type: DataTypes.STRING, allowNull: false },
    town_city: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    list_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image_name: { type: DataTypes.STRING, allowNull: false },
    bedrooms: { type: DataTypes.INTEGER, allowNull: false },
    ensuite: { type: DataTypes.BOOLEAN, allowNull: false },
    sold: { type: DataTypes.BOOLEAN, allowNull: false },
    featured: { type: DataTypes.BOOLEAN, allowNull: false },
    pool: { type: DataTypes.BOOLEAN, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, {
    tableName: 'properties',
    timestamps: false
});

module.exports = Property;
