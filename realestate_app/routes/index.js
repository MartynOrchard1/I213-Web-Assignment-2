const express = require('express');
const router = express.Router();
const Property = require('../models/property'); // Import the Property model
const Suburb = require('../models/suburb');     // Import the Suburb model

// Home Page
router.get('/', async (req, res) => {
  try {
    // Fetch 18 distinct suburbs
    const suburbs = await Suburb.findAll({
      attributes: ['name'], // Adjust the column name if necessary
      limit: 18
    });

    // Fetch 21 properties
    const properties = await Property.findAll({
      limit: 21
    });

    res.render('home', { suburbs, properties });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Fetch properties based on selected suburb
router.get('/properties', async (req, res) => {
  const { suburb } = req.query;

  if (!suburb) {
    return res.redirect('/');
  }

  try {
    // Fetch properties for the selected suburb
    const properties = await Property.findAll({
      where: { suburb },
      limit: 21
    });

    // Fetch all suburbs to maintain the sidebar
    const suburbs = await Suburb.findAll({
      attributes: ['name'],
      limit: 18
    });

    res.render('home', { suburbs, properties, selectedSuburb: suburb });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
