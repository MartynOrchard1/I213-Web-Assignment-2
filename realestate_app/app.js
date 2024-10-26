const express = require("express");
const session = require('express-session');
const { engine } = require("express-handlebars");
const path = require('path');
const sequelize = require('./db');
const homeRoutes = require('./routes/home');
const suburbRoutes = require('./routes/suburb');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dash');
const addProp = require('./routes/functions/create');
const editProp = require('./routes/functions/edit');
const delProp = require('./routes/functions/delete');

const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars setup
app.engine("handlebars", engine({ partialsDir: path.join(__dirname, "views/partials") }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


// Static files
app.use(express.static(path.join(__dirname, "public")));

// JSON/URL Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.use('/', homeRoutes);
app.use('/', suburbRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('', addProp);
app.use('/properties', editProp);
app.use('/properties/delete', delProp);

// Error-handling middleware
app.use((err, res) => {
    console.error(err);
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
