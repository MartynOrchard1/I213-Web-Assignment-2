const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Property = sequelize.define('Property', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING, allowNull: false },
    suburb: { type: DataTypes.STRING, allowNull: false },
    town_city: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    list_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    image_name: { type: DataTypes.STRING, allowNull: false },
    bedrooms: { type: DataTypes.INTEGER, allowNull: false },
    ensuite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    sold: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    pool: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, {
    tableName: 'properties',
    timestamps: false // Disable Sequelize auto timestamps since we're managing them manually.
});

module.exports = Property;
