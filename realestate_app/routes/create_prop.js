const express = require('express');
const router = express.Router();
const Property = require('../models/Property');  // Import the Sequelize model

// GET route to render the add property form
router.get('/create', (req, res) => {
  res.render('add_prop');  // Render the add_prop.handlebars file
});

// POST route to handle form submission using Sequelize
router.post('/properties/add', async (req, res) => {
  const { address, list_price, suburb } = req.body;
  const image = req.file;  // Assuming you handle file uploads

  try {
    // Use Sequelize to insert data into the database
    await Property.create({
      address,
      list_price,
      suburb,
      image_name: image ? image.filename : null  // Only if image is uploaded
    });

    res.redirect('/dashboard');  // Redirect to dashboard after adding the property
  } catch (err) {
    console.error('Error adding property:', err);
    res.status(500).send('Failed to add property');
  }
});

module.exports = router;