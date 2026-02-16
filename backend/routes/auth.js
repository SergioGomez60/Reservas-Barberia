const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// JWT Secret - usar variable de entorno o valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'barber-secret-key-2024';

// POST /register - Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validar que email y password existan
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Validar que name exista
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    // Verificar que el email no esté registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Encriptar la contraseña con bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el usuario con role 'client' por defecto
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'client'
    });

    const savedUser = await newUser.save();

    // Generar un token JWT con el userId
    const token = jwt.sign(
      { userId: savedUser._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver { token, user: { id, name, email, role } }
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// POST /login - Iniciar sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar que email y password existan
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verificar contraseña con bcryptjs.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Devolver { token, user: { id, name, email, role } }
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
