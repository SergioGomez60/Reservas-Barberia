const express = require('express');
const router = express.Router();
const Barber = require('../models/Barber');

// GET all barbers
router.get('/', async (req, res) => {
  try {
    const barbers = await Barber.find();
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a single barber by ID
router.get('/:id', async (req, res) => {
  try {
    const barber = await Barber.findById(req.params.id);
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    res.json(barber);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new barber
router.post('/', async (req, res) => {
  const { name, specialty } = req.body;

  if (!name || !specialty) {
    return res.status(400).json({ message: 'Name and specialty are required' });
  }

  const newBarber = new Barber({
    name,
    specialty
  });

  try {
    const savedBarber = await newBarber.save();
    res.status(201).json(savedBarber);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT (update) a barber
router.put('/:id', async (req, res) => {
  const { name, specialty } = req.body;

  try {
    const barber = await Barber.findByIdAndUpdate(
      req.params.id,
      { name, specialty },
      { new: true, runValidators: true }
    );
    
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    res.json(barber);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a barber
router.delete('/:id', async (req, res) => {
  try {
    const barber = await Barber.findByIdAndDelete(req.params.id);
    
    if (!barber) {
      return res.status(404).json({ message: 'Barber not found' });
    }
    res.json({ message: 'Barber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
