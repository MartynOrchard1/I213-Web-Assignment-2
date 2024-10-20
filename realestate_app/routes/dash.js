const express = require("express");
const router = express.Router();

// Protected Route: Dashboard
router.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user, layout: false, title: "Dashboard" });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
