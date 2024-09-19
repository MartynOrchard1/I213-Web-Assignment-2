const Sequelize = require('sequelize'); // Sequelize ORM

// Database connection (change according to your configuration)
const sequelize = new Sequelize('realestate', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

// Import the models
const Property = require('./property'); // Property model (suburb no longer needed)

// Sync the models (this ensures the tables exist in the database)
sequelize.sync().then(() => {
    console.log("All models were synchronized successfully.");
}).catch((err) => {
    console.error("Error syncing the models:", err);
});

// Export the models to use them in other parts of the application
module.exports = {
    Property // Export the Property model (suburb not needed anymore)
};
