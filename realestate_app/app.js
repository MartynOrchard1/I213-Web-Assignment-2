const express = require('express');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');  // Import raw Handlebars engine
const path = require('path');
const sequelize = require('./db'); // Sequelize instance
const app = express();
const port = 3000;

// Middleware for parsing request bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars as the template engine
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Sync Sequelize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables synced successfully!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Routes
app.use('/', require('./routes/index')); // Main routes file

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
