const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new service
router.post('/', async (req, res) => {
  const { name, price, duration } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ message: 'Name, price and duration are required' });
  }

  const newService = new Service({
    name,
    price,
    duration
  });

  try {
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (update) a service
router.put('/:id', async (req, res) => {
  const { name, price, duration } = req.body;

  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, price, duration },
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
