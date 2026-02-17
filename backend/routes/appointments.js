const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { sendAppointmentConfirmation } = require('../src/emailService');

// POST /appointments to create a new appointment
router.post('/', async (req, res) => {
  const { client, email, barberId, serviceId, date, time, phone, notes, userId } = req.body;

  if (!client || !email || !barberId || !serviceId || !date || !time) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    // Check if there is already an appointment at the same time with the same barber
    const existingAppointment = await Appointment.findOne({
      barberId,
      date,
      time
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Appointment already exists at this time with this barber' });
    }

    const newAppointment = new Appointment({
      client,
      email,
      barberId,
      serviceId,
      date,
      time,
      phone: phone || '',
      notes: notes || '',
      userId: userId || null
    });

    const savedAppointment = await newAppointment.save();
    // Populate the saved appointment
    const populatedAppointment = await Appointment.findById(savedAppointment._id)
      .populate('barberId')
      .populate('serviceId');

    // Enviar correo de confirmación (sin await para no bloquear la respuesta)
    sendAppointmentConfirmation(populatedAppointment);

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// GET /appointments to get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('barberId')
      .populate('serviceId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /appointments/:date to get all appointments for a specific date
router.get('/date/:date', async (req, res) => {
  const { date } = req.params;

  try {
    const appointments = await Appointment.find({ date })
      .populate('barberId')
      .populate('serviceId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /appointments/barber/:barberId to get all appointments for a specific barber
router.get('/barber/:barberId', async (req, res) => {
  const { barberId } = req.params;

  try {
    const appointments = await Appointment.find({ barberId })
      .populate('barberId')
      .populate('serviceId');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /appointments/user/:userId to get all appointments for a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const appointments = await Appointment.find({ userId })
      .populate('barberId')
      .populate('serviceId')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /appointments/:id to get a single appointment
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('barberId')
      .populate('serviceId');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /appointments/:id to update an appointment
router.put('/:id', async (req, res) => {
  const { client, barberId, serviceId, date, time, phone, notes, status } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { client, barberId, serviceId, date, time, phone, notes, status },
      { new: true, runValidators: true }
    )
      .populate('barberId')
      .populate('serviceId');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /appointments/:id to delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
