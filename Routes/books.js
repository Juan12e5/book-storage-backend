const express = require('express');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');
process.loadEnvFile()

const SECRET_KEY = process.env.SECRET_KEY

const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Agregar libro
router.post('/', authenticateToken, async (req, res) => {
    const { title, author, description,publishedDate  } = req.body;
    const book = new Book({ title, author, description, publishedDate, userId: req.user.userId });
    await book.save();
    res.status(201).send(book);
});

// Obtener los libros por usuario
router.get('/', authenticateToken, async (req, res) => {
    const books = await Book.find({ userId: req.user.userId });
    res.json(books);
});

// Obtener los libros por su id/uuid
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, userId: req.user.userId });
        if (!book) {
            return res.status(404).send({ message: 'Libro no encontrado' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).send({ message: 'Error al obtener el libro', error });
    }
});

// Actualizar el contenido de un libro por id/uuid
router.put('/:id', authenticateToken, async (req, res) => {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(book);
});

// Eliminar un libro por id/uuid
router.delete('/:id', authenticateToken, async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

module.exports = router;
