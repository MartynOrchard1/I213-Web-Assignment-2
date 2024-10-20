const express = require("express");
const router = express.Router();
const app = express();

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Route: Login Page
router.get('/login', (req, res) => {
    res.render('login', { layout: "main", title: "Login" });
});

// POST Route: Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.render('login', {
            layout: "main",
            title: "Login",
            error: "Invalid Credentials. Please try again."
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


module.exports = router;
