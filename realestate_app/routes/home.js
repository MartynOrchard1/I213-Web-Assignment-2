const express = require("express");
const router = express.Router();
const Property = require('../models/property');

// Route: Home Page
router.get("/", async (req, res) => {
    try {
        const properties = await Property.findAll({
            where: { active: true },
            order: sequelize.random(),
            limit: 21
        });
        const plainProperties = properties.map(prop => {
            const property = prop.get({ plain: true });
            property.image_url = `/images/houses/${property.image_name}`;
            return property;
        });

        const suburbs = await Property.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
            where: { active: true },
            limit: 18
        });
        const plainSuburbs = suburbs.map(suburb => suburb.get({ plain: true }));

        res.render("home", {
            layout: "main",
            title: "Home",
            properties: plainProperties,
            suburbs: plainSuburbs
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).send('An error occurred while fetching properties');
    }
});

module.exports = router;
