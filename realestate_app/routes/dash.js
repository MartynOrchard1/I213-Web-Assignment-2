const express = require('express');
const router = express.Router();
const Property = require('../models/property'); 
const { Op } = require('sequelize');
const { deleteScript } = require('./functions/delete');

// Protected Route: Dashboard
router.get('/dashboard', async (req, res) => {
    if (req.session.user) {
        try {
            const properties = await Property.findAll({
                where: {
                    [Op.or]: [
                        { id: { [Op.gt]: 6882 } },
                        { id: { [Op.between]: [6873, 6882] } }
                    ]
                    // id: [6897, 6882, 6881, 6880, 6879, 6878, 6877, 6876, 6875, 6874, 6873] // Array of id's to pull from DB !! KEEP THIS FOR TESTING PURPOSES !!
                },
                order: [['id', 'DESC']] // Sort in descending order | Change 'DESC' to 'ASC' if you wish it to be ascending order
            });
            
            res.render('dashboard', {
                user: req.session.user,
                properties: properties.map(p => p.toJSON()), // JSON Conversion
                layout: false,
                title: 'Dashboard',
                deleteScript: deleteScript
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
