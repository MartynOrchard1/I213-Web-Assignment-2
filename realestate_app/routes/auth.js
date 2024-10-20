const express = require("express");
const router = express.Router();
const app = express();


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


module.exports = router;
