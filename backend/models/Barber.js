const mongoose = require('mongoose');

const BarberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  available: {
    type: Boolean,
    default: true
  },
  workingHours: {
    type: Map,
    of: String,
    default: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '09:00-14:00',
      sunday: 'closed'
    }
  }
}, {
  timestamps: true
});

module.exports = Barber = mongoose.model('barber', BarberSchema);
