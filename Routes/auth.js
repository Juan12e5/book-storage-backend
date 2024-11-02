const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
process.loadEnvFile()
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY

// Registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    
    await user.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
});


// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { 
                userId: user._id, 
                username: user.username,
            }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );
        res.json({ token });
    } else {
        res.status(400).send('Credenciales inválidas');
    }
    
});

module.exports = router;