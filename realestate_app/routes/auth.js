const express = require("express");
const router = express.Router();
const app = express();
const sequelize = require('../db');
const User = require('../models/user');
const { title } = require("process");


// Route: Login Page
router.get('/login', (req, res) => {
    res.render('login', { layout: "main", title: "Login" });
});

// POST Route: Login
router.post('/login', async (req, res) => {
    try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username }});

    if (user && await user.validPassword(password)) {
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.render('login', {
            layout: "main",
            title: "Login",
            error: "Invalid Credentials. Please try again."
        });
    }
} catch (error) {
    console.log(error);
}
});

// Registration Route (GET) !! PROTECTED !!
router.get("/register", async (req,res) => {
    if (req.session.user) {
        res.render("register", { layout: false, title: "Register"});
    }
    else {
        res.redirect('/login');
    }
});

// Registration Route (POST)
router.post('/register', async (req,res) => {
    try {
        const { username, password } = req.body;
        await User.create({ username, password});
        res.redirect('/login');
    } catch (error) {
        res.render('register', { layout: false, title: "Register", error: error.message});
    }
});


module.exports = router;
