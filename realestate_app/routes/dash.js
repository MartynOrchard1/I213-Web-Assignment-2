const express = require('express');
const router = express.Router();
const Property = require('../models/property'); 

// Protected Route: Dashboard
router.get('/dashboard', async (req, res) => {
    if (req.session.user) {
        try {
            const properties = await Property.findAll();
            res.render('dashboard', {
                user: req.session.user,
                properties: properties.map(p => p.toJSON()), // Ensure properties are serialized for Handlebars
                layout: false,
                title: 'Dashboard'
            });
        } catch (error) {
            console.error('Error fetching properties:', error);
            res.status(500).send('An error occurred while fetching properties.');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
