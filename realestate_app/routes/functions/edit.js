const express = require('express');
const router = express.Router();
const Property = require('../../models/property');
const multer = require('multer');

// Set up multer for file uploads (optional image field)
const upload = multer({ dest: 'uploads/' });  // Adjust the upload path as necessary

// GET route: Render the edit form for a property by ID
router.get('/edit/:id', async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id); // Fetch the property by ID
    if (!property) {
      return res.status(404).send('Property not found');
    }
    res.render('properties/edit', { property });  // Pass the property data to edit.handlebars
  } catch (err) {
    console.error('Error fetching property:', err);
    res.status(500).send('Internal Server Error');
  }
});

// POST route: Update the property with edited details
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
      updatedData.image_name = req.file.filename;
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
