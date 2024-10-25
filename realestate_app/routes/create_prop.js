const express = require('express');
const router = express.Router();
const Property = require('../models/property'); 
const { error } = require('console');
const multer = require('multer');

// GET route: add_prop.handlebars
router.get('/create', (req, res) => {
  res.render('add_prop');  // Render the add_prop.handlebars file
});

// POST route: Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Path to uploads directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Random unique file name
  }
});

const upload = multer({ storage: storage }); 

// POST route to handle form submission with file upload
router.post('/properties/add', upload.single('image'), async (req, res) => {
  const { address, list_price, suburb } = req.body;
  const image = req.file;

  try {
    // Insert this data into the database ... 
    await Property.create({
      address,
      list_price,
      suburb,
      image_name: image ? image.originalname : null 
    });

    res.redirect('/dashboard');  // Redirect after adding the property
  } catch (err) {
    // Debug and error messages
    console.error('Error adding property:', err);
    res.status(500).send(`Error adding property: ${err.message}`);
  }
});

// Export
module.exports = router;
