// Import Statements
const express = require("express");
const session = require('express-session'); 
const { engine } = require("express-handlebars"); 
const path = require('path'); 
const { Sequelize, DataTypes } = require('sequelize');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars setup
app.engine("handlebars", engine({ partialsDir: path.join(__dirname, "views/partials") }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Static File setup (public folder)
app.use(express.static(path.join(__dirname, "public")));

// JSON/URL Middleware
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
}, 
{
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
        // Fetch random active properties
        const properties = await Property.findAll({
            where: { active: true },  // Only fetch active properties
            order: sequelize.random(), // Select random properties
            limit: 21 // Property limit, !!if you wish to expand the grid you have to also expand the limit!!
        });
  
        // Image setup
        const plainProperties = properties.map(prop => {
            const property = prop.get({ plain: true });
            property.image_url = `/images/houses/${property.image_name}`; // Image path
            return property;
        });
  
        // Fetch suburbs for the sidebar
        const suburbs = await Property.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
            where: { active: true }, // Only active properties displayed | if field has in DB has active set to 0 then it will not display on this website. If active is set to 1 it will display 
            limit: 18 // Suburb Limit - edit this as needed
        });
        const plainSuburbs = suburbs.map(suburb => suburb.get({ plain: true }));
        
        // Render the page
        res.render("home", {
            layout: "main", // Use main.handlebars as a template for nav, hero, footer
            title: "Home", // Page Title
            properties: plainProperties, 
            suburbs: plainSuburbs
        });
    } catch (error) { // If there's an error do this...
        console.error('Error fetching properties:', error);
        res.status(500).send('An error occurred while fetching properties');
    }
  });

// Route: Subrub
app.get("/filter/:suburb", async (req, res) => {
    try {
        const suburbName = req.params.suburb;
        let properties;

        // If suburb is "All", show all properties
        if (suburbName === "All") {
            properties = await Property.findAll({
                limit: 21 // Property Limit Increase/Decrease as needed
            });
        } else {
            properties = await Property.findAll({
                where: { suburb: suburbName },
                limit: 21 // Property Limit Increase/Decrease as needed
            });
        }

        const plainProperties = properties.map(prop => {
            const property = prop.get({ plain: true });
            property.image_url = `/images/houses/${property.image_name}`;
            return property;
        });

        // Fetch distinct suburbs again for sidebar, ordered alphabetically
        const suburbs = await Property.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
            order: [['suburb', 'ASC']],  // Order alphabetically
            limit: 21 // Property Limit Increase/Decrease as needed
        });
        const plainSuburbs = [{ suburb: 'All' }, ...suburbs.map(suburb => suburb.get({ plain: true }))];
        
        // Render the page
        res.render("home", {
            layout: "main", // Use main.handlebars as a template for nav, hero, footer
            title: "Home", // Title of page
            properties: plainProperties, 
            suburbs: plainSuburbs 
        });
    } catch (error) { // If there's an error do this...
        console.error('Error filtering properties: ', error);
        res.status(500).send('An error occurred while filtering properties');
    }
});

// Route: Login Page
app.get('/login', (req, res) => {
    res.render('login', 
        { 
            layout: "main", // Use main.handlebars as a template for nav, hero, footer
            title: "Login" // Page Title
        });
});

// POST Route: Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') { // You can set a custom username and password here
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.render('login', {
            layout: "main",  // Use main.handlebars as a template for nav, hero, footer
            title: "Login", // Page Title
            error: "Invalid Credentials. Please try again." // Error Message
        });
    }
});

// Protected Route: Dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        user: req.session.user, 
        layout: false, // No layout
        title: "Dashboard" // Page Title
    });
});

// Error-handling middleware
app.use((err, res) => {
    console.error(err); // Error message
    res.status(500).send('Something went wrong!');
});


// Start the server
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully"); // Successfull connection
    } catch (error) {
        console.error("Unable to connect to the database:", error); // Err
    }
    console.log(`Server is running on http://localhost:${PORT}`); // Logs the server running, the address, and port
});
