const express = require('express');
const router = express.Router();
const Property = require('../models/property');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Specify the uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Generate unique file names
  }
});

const upload = multer({ storage: storage });

// POST route to handle form submission with file upload
router.post('/properties/add', upload.single('image'), async (req, res) => {
  const { address, list_price, suburb } = req.body;
  const image = req.file;

  try {
    // Insert data into the database
    await Property.create({
      address,
      list_price,
      suburb,
      image_name: image ? image.filename : null  // Save the filename if an image is uploaded
    });

    res.redirect('/dashboard');  // Redirect after adding the property
  } catch (err) {
    console.error('Error adding property:', err);
    res.status(500).send(`Error adding property: ${err.message}`);
  }
});

module.exports = router;
