const express = require('express');
const router = express.Router();
const db = require('../db');  // Assuming you export the db connection

// Setup Home Page
router.get('/', (req, res) => {
    const sql = 'SELECT DISTINCT suburb FROM properties LIMIT 18';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('home', { suburbs: results});
    });
});

// Setup Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// POST
router.post('/login', (req, res) => {
    const { username, password} = req.body;
    if (username === 'admin' && password === 'password') {
        res.redirect('/dashboard');
    } 
    else {
        res.redirect('/login');
    }
});

// Setup Dashbaord Page
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// Module Export
module.exports = router;