const mongoose = require('mongoose');

const BarberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  }
});

module.exports = Barber = mongoose.model('barber', BarberSchema);
