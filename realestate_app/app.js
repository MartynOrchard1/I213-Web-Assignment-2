// Import necessary modules
const express = require("express");
const session = require('express-session'); // For session handling (authentication)
const { engine } = require("express-handlebars"); // Handlebars templating engine
const path = require('path'); // Utility to handle file paths
const { Sequelize, DataTypes } = require('sequelize'); // Sequelize ORM

// Initialize Express app and define the port
const app = express();
const PORT = process.env.PORT || 3000;

// Set up Handlebars as the view engine with the path to partials
app.engine("handlebars", engine({ partialsDir: path.join(__dirname, "views/partials") }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Serve static files (like CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware to manage user sessions
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
}));

// Database connection
const sequelize = require('./db');

// Define Property model
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

// Middleware to check if a user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Route: Home Page
app.get("/", async (req, res) => {
  try {
      // Fetch properties (limit as needed)
      const properties = await Property.findAll({ limit: 21 });
      const plainProperties = properties.map(prop => {
          const property = prop.get({ plain: true });
          property.image_url = `/images/houses/${property.image_name}`; // Assuming images are in the public folder
          return property;
      });

      // Fetch distinct suburbs from the database, ordered alphabetically
      const suburbs = await Property.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
          order: [['suburb', 'ASC']] // Order alphabetically
      });

      // Add 'All' as a default option for viewing all properties
      const plainSuburbs = [{ suburb: 'All' }, ...suburbs.map(suburb => suburb.get({ plain: true }))];

      res.render("home", {
          layout: "main",
          title: "Home",
          properties: plainProperties,  // Pass properties with image URLs
          suburbs: plainSuburbs          // Pass suburbs for the sidebar
      });
  } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).send('An error occurred while fetching properties');
  }
});

// Route: Filter Properties by Suburb
app.get("/filter/:suburb", async (req, res) => {
    try {
        const suburbName = req.params.suburb;
        let properties;

        // If suburb is "All", show all properties
        if (suburbName === "All") {
            properties = await Property.findAll();
        } else {
            properties = await Property.findAll({
                where: { suburb: suburbName }
            });
        }

        const plainProperties = properties.map(prop => prop.get({ plain: true }));

        // Fetch distinct suburbs again for sidebar, ordered alphabetically
        const suburbs = await Property.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
            order: [['suburb', 'ASC']] // Order alphabetically
        });
        const plainSuburbs = [{ suburb: 'All' }, ...suburbs.map(suburb => suburb.get({ plain: true }))];

        res.render("home", {
            layout: "main",
            title: "Home",
            properties: plainProperties,
            suburbs: plainSuburbs
        });
    } catch (error) {
        console.error('Error filtering properties:', error);
        res.status(500).send('An error occurred while filtering properties');
    }
});

// Other routes (Login, Dashboard, etc.) remain unchanged

// Start the server
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
    console.log(`Server is running on http://localhost:${PORT}`);
});
