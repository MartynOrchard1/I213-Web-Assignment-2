// Express
const express = require('express');
const session = require('express-session');
const { engine } = reqiore("express-handlebars")
const path = require('path');

// Database 
const sequelize = require('./db'); // Sequelize instance
const app = express();
const port = 3000;

// Middleware for parsing request bodies (e.g., form submissions)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
