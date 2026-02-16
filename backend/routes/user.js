const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret - usar variable de entorno o valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'barber-secret-key-2024';

// Middleware de autenticación JWT
const authenticateToken = async (req, res, next) => {
  // Extraer el token del header Authorization (formato: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    // Verificar el token con jwt.verify
    const decoded = jwt.verify(token, JWT_SECRET);

    // Buscar el usuario por el id del token
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Agregar el usuario a req.user
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// GET /profile - Obtener datos del usuario logueado (ruta protegida)
router.get('/profile', authenticateToken, async (req, res) => {
  // Devolver los datos del usuario sin password: { id, name, email, role, createdAt }
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt
  });
});

module.exports = router;
