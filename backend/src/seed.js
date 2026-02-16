const mongoose = require('mongoose');
require('dotenv').config();

const Barber = require('../models/Barber');
const Service = require('../models/Service');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/barber-reservations';

const barbers = [
  {
    name: 'Carlos Rodríguez',
    specialty: 'Cortes clásicos y modernos',
    bio: 'Barbero con más de 10 años de experiencia en cortes tradicionales',
    phone: '+34 612 345 678',
    email: 'carlos@barberia.com',
    available: true,
    image: ''
  },
  {
    name: 'Miguel Sánchez',
    specialty: 'Barba y afeitado tradicional',
    bio: 'Especialista en arreglos de barba y afeitados con navaja',
    phone: '+34 623 456 789',
    email: 'miguel@barberia.com',
    available: true,
    image: ''
  },
  {
    name: 'Antonio García',
    specialty: 'Cortes juveniles y tendencias',
    bio: 'Siempre a la última en tendencias de cortes de pelo',
    phone: '+34 634 567 890',
    email: 'antonio@barberia.com',
    available: true,
    image: ''
  }
];

const services = [
  {
    name: 'Corte de pelo',
    price: 20,
    duration: 30
  },
  {
    name: 'Arreglo de barba',
    price: 15,
    duration: 20
  },
  {
    name: 'Corte + Barba',
    price: 30,
    duration: 45
  },
  {
    name: 'Afeitado con navaja',
    price: 18,
    duration: 25
  },
  {
    name: 'Tratamiento capilar',
    price: 25,
    duration: 35
  },
  {
    name: 'Coloración',
    price: 35,
    duration: 60
  }
];

mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing data
      await Barber.deleteMany({});
      await Service.deleteMany({});
      
      // Insert new data
      const createdBarbers = await Barber.insertMany(barbers);
      const createdServices = await Service.insertMany(services);
      
      console.log('Database seeded successfully!');
      console.log(`Created ${createdBarbers.length} barbers`);
      console.log(`Created ${createdServices.length} services`);
      
    } catch (error) {
      console.error('Error seeding database:', error);
    }
    
    mongoose.disconnect();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
