const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js file that exports the MySQL connection

// Home Page
router.get('/', (req, res) => {
  // Fetch 18 distinct suburbs from the database
  const sql = 'SELECT DISTINCT suburb FROM properties LIMIT 18';
  db.query(sql, (err, suburbs) => {
    if (err) throw err;

    // Fetch 21 properties to display on the home page
    const propertySql = 'SELECT * FROM properties LIMIT 21';
    db.query(propertySql, (err, properties) => {
      if (err) throw err;

      res.render('home', { suburbs, properties });
    });
  });
});

// Login Page (GET request)
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission (POST request)
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded credentials check (you can replace this with a real authentication system)
  if (username === 'admin' && password === 'password') {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login?error=Invalid credentials');
  }
});

// Dashboard Page (GET request)
router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

// Fetch properties based on selected suburb
router.get('/properties', (req, res) => {
  const suburb = req.query.suburb; // Get suburb from query parameter

  if (!suburb) {
    return res.redirect('/'); // Redirect to home if no suburb is selected
  }

  // Fetch properties for the selected suburb
  const sql = 'SELECT * FROM properties WHERE suburb = ? LIMIT 21';
  db.query(sql, [suburb], (err, properties) => {
    if (err) throw err;

    // Fetch the same list of 18 distinct suburbs to display in the sidebar
    const suburbSql = 'SELECT DISTINCT suburb FROM properties LIMIT 18';
    db.query(suburbSql, (err, suburbs) => {
      if (err) throw err;

      // Render the home page with filtered properties and suburb list
      res.render('home', { suburbs, properties, selectedSuburb: suburb });
    });
  });
});

module.exports = router;
