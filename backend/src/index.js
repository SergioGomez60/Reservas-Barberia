const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Import routes
const appointmentsRouter = require('../routes/appointments');
const barbersRouter = require('../routes/barbers');
const servicesRouter = require('../routes/services');
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');

// Use routes
app.use('/api/appointments', appointmentsRouter);
app.use('/api/barbers', barbersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Barber Reservation API is running');
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/barber-reservations';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server after successful DB connection
    startServer();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    // Still start server but log error
    startServer();
  });

function startServer() {
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}`);
      app.listen(port + 1, () => {
        console.log(`Server is running on port ${port + 1}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
