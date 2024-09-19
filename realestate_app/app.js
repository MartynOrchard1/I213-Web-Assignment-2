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
app.engine(
    "handlebars",
    engine({
        partialsDir: path.join(__dirname, "views/partials"), // Path to partial views
    })
);
app.set("view engine", "handlebars"); // Set Handlebars as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Serve static files (like CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session middleware to manage user sessions
app.use(session({
    secret: 'mySecretKey', // Session secret
    resave: false,
    saveUninitialized: true
}));

// Database connection (Sequelize)
const sequelize = new Sequelize('realestate', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

// Define Property and Suburb models
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
      const properties = await Property.findAll({
          limit: 21
      });
      const plainProperties = properties.map(prop => {
          const property = prop.get({ plain: true });
          // Assuming images are stored in the 'public/images/houses/' directory
          property.image_url = `/images/houses/${property.image_name}`;
          console.log(property.image_url);
          return property;
      });

      // Fetch suburbs (as before)
      const suburbs = await Property.findAll({
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
          limit: 18
      });
      const plainSuburbs = suburbs.map(suburb => suburb.get({ plain: true }));

      res.render("home", {
          layout: "main",
          title: "Home",
          properties: plainProperties,  // Pass properties with image URLs
          suburbs: plainSuburbs
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

        if (suburbName === "All") {
            properties = await Property.findAll();
        } else {
            properties = await Property.findAll({
                where: { suburb: suburbName }
            });
        }

        const plainProperties = properties.map(prop => prop.get({ plain: true }));

        const suburbs = await Property.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
            limit: 18
        });
        const plainSuburbs = suburbs.map(suburb => suburb.get({ plain: true }));

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

// Route: Login Page
app.get('/login', (req, res) => {
    res.render('login', { layout: false, title: "Login" });
});

// POST Route: Handle Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid Credentials. Please <a href="/login">Try Again</a>.');
    }
});

// Protected Route: Dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.session.user,
        layout: false,
        title: "Dashboard"
    });
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

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
