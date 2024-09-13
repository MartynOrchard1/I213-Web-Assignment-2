// routes/index.js
const express = require('express');
const router = express.Router();
const Property = require('../models/property');
const Suburb = require('../models/suburb');

router.get('/', async (req, res) => {
  try {
    // Fetch properties and include the suburb data via association
    const properties = await Property.findAll({
      limit: 21,
      include: {
        model: Suburb, // Include the Suburb model to get suburb name
        attributes: ['name']  // Only select the suburb name
      }
    });

    // Fetch suburbs for sidebar or other needs
    const suburbs = await Suburb.findAll({
      limit: 18
    });

    res.render('home', { properties, suburbs });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
