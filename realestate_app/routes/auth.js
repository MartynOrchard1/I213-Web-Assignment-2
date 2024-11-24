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

// Route: Logout
router.get('/logout', (req, res) => {
    // Display which user has logged out in the console
    const username = req.session.user
    if (username) {
        console.log(`${username} has logged out.`);
    } else {
        console.log('User has logged out (Username not found)');
    }

    // Destroy Users Session so they can't paste routes into the url and gain access
    req.session.destroy(err => {
        if (err) { // If there's an error logging out do this...
            console.error('Error Logging out: ', err);
            return res.status(500).send('Could not log out');
        }
        // Clear Cookie
        res.clearCookie('connect.sid');
        res.redirect('/login');
    })
})

// Route: Registration (GET) !! PROTECTED !!
router.get("/register", async (req,res) => {
    if (req.session.user) {
        try {
            res.render("register", { 
                layout: "main", 
                title: "User Registration", 
                error: "Not Authenticated" 
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        res.redirect('/login');
    }
});

// Post Route: Registration
router.post('/register', async (req,res) => {
    try {
        const { username, password } = req.body;
        await User.create({ username, password});
        res.redirect('/register');
    } catch (error) {
        res.render('register', { layout: false, title: "User Registration", error: error.message});
    }
});

module.exports = router;