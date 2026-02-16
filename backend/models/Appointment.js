const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true
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
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

module.exports = Appointment = mongoose.model('appointment', AppointmentSchema);
