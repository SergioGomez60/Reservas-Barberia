const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'barber',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'service',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema);
