const express = require('express');
const router = express.Router();
const Property = require('../../models/property');

// GET route: View Form For Property
router.get("/view/:id", async (req, res) => {
    if (req.session.user) {
        try {
            const property = await Property.findByPk(req.params.id);
            if (!property) {
                return res.status(404).send("Property not found");
            }
            const plainProperty = property.get({ plain: true });
            plainProperty.image_url = `/images/houses/${plainProperty.image_name}`; 

            res.render("properties/show", {
                layout: "main",
                title: "View Property",
                property: plainProperty
            });
        } catch (error) {
            console.error('Error fetching property:', error);
            res.status(500).send('An error occurred while fetching the property');
        }
    } else {
        res.redirect('/login');
    }
});

// Export
module.exports = router;
