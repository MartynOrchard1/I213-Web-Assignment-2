const express = require('express');
const router = express.Router();
const Property = require('../../models/property');

// Delete Route
router.delete('/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(`Received request to delete property with ID: ${propertyId}`);
    
    // Check if propertyId is valid
    if (!propertyId) {
      console.log('Property ID is missing');
      return res.status(400).json({ error: 'Property ID is required' });
    }

    const property = await Property.findByPk(propertyId);
    if (!property) {
      console.log('Property not found');
      return res.status(404).json({ error: 'Property not found' });
    }

    await property.destroy();
    console.log('Property deleted successfully');
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
