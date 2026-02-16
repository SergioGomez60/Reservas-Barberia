const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// POST /appointments to create a new appointment
router.post('/', async (req, res) => {
  const { client, barberId, serviceId, date, time } = req.body;

  // Check if there is already an appointment at the same time with the same barber
  const existingAppointment = await Appointment.findOne({
    barberId,
    date,
    time
  });

  if (existingAppointment) {
    return res.status(400).json({ message: 'Appointment already exists at this time' });
  }

  const newAppointment = new Appointment({
    client,
    barberId,
    serviceId,
    date,
    time
  });

  try {
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /appointments/:date to get all appointments for a specific date
router.get('/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const appointments = await Appointment.find({ date }).populate('barberId serviceId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
