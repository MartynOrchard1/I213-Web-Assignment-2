const express = require('express');
const router = express.Router();
const Property = require('../../models/property');

// DELETE route for deleting a property
router.delete('/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await property.destroy();
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
