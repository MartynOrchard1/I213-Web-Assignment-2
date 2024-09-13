const { Sequelize } = require('sequelize');

// Create Sequelize instance and connect to MySQL database
const sequelize = new Sequelize('realestate', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection Successful');
  })
  .catch(err => {
    console.error('Unable to connect: ', err);
  });

module.exports = sequelize;