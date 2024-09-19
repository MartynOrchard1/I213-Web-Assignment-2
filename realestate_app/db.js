const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('item_database', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
}) ;

module.exports = sequelize;