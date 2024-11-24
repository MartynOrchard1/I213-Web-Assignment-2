const express = require('express');
const router = express.Router();
const Property = require('../../models/property');
const { Sequelize } = require('sequelize');
const multer = require('multer');

// Set up multer for file uploads (optional image field)
const upload = multer({ dest: 'uploads/' });  // Adjust the upload path as necessary

// GET route: Edit Form !! PROTECTED !!
router.get("/edit/:id", async (req, res) => {
  if (req.session.user) {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) {
            return res.status(404).send("Property not found");
        }
        const plainProperty = property.get({ plain: true });
        plainProperty.image_url = `/images/houses/${plainProperty.image_name}`;

        // Update the render call to include the properties directory
        res.render("properties/edit", {
            layout: "main",
            title: "Edit Property",
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

// POST route: Update Property
router.post('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    const { address, suburb, list_price } = req.body;
    const updatedData = {
      address,
      suburb,
      list_price
    };

    // Only update the image if a new file was uploaded
    if (req.file) {
      updatedData.image_name = req.file.originalname;
    }

    await Property.update(updatedData, {
      where: { id: req.params.id }
    });

    res.redirect('/dashboard');  // Redirect to the dashboard after updating
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Export
module.exports = router;
