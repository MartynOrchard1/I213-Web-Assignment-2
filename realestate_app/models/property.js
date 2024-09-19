const { Sequelize, DataTypes } = require('sequelize'); // Sequelize for ORM

// Database connection (replace with your actual credentials)
const sequelize = new Sequelize('realestate', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

// Define the Property model based on the table structure you shared
const Property = sequelize.define('Property', {
    // Define the fields based on your table
    address: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    suburb: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    town_city: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { 
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    list_price: { 
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false 
    },
    image_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    bedrooms: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    ensuite: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false 
    },
    sold: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false 
    },
    featured: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false 
    },
    pool: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false 
    },
    active: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false 
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.NOW 
    },
    updated_at: { 
        type: DataTypes.DATE, 
        defaultValue: Sequelize.NOW 
    }
}, {
    tableName: 'properties', // Ensure this matches the table name in your database
    timestamps: false // Since we are manually controlling created_at and updated_at
});

// Sync the model with the database
sequelize.sync().then(() => {
    console.log("Properties table synced successfully.");
}).catch((err) => {
    console.error("Error syncing the Properties table:", err);
});

// Export the model so we can use it in other files
module.exports = Property;
