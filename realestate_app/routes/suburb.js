const express = require("express");
const router = express.Router();
const Property = require('../models/property');

// Route: Suburb Filter
router.get("/filter/:suburb", async (req, res) => {
    try {
        const suburbName = req.params.suburb;
        let properties;

        if (suburbName === "All") {
            properties = await Property.findAll({ limit: 21 });
        } else {
            properties = await Property.findAll({
                where: { suburb: suburbName },
                limit: 21
            });
        }

        const plainProperties = properties.map(prop => {
            const property = prop.get({ plain: true });
            property.image_url = `/images/houses/${property.image_name}`;
            return property;
        });

        const suburbs = await Property.findAll({
            attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('suburb')), 'suburb']],
            order: [['suburb', 'ASC']],
            limit: 21
        });
        const plainSuburbs = [{ suburb: 'All' }, ...suburbs.map(suburb => suburb.get({ plain: true }))];

        res.render("home", {
            layout: "main",
            title: "Home",
            properties: plainProperties,
            suburbs: plainSuburbs
        });
    } catch (error) {
        console.error('Error filtering properties: ', error);
        res.status(500).send('An error occurred while filtering properties');
    }
});

module.exports = router;
