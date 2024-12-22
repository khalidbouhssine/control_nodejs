const express = require('express');
const bookController = require('../controllers/bookController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Book routes
router.post('/books', authenticateToken, bookController.createBook); // Create a book
router.get('/books', authenticateToken, bookController.getBooks); // Get all books
router.get('/books/:id', authenticateToken, bookController.getBookById); // Get a book by ID
router.get('/books/search/:query', authenticateToken, bookController.searchBooks); // Search books by title, author, or genre
router.put('/books/:id', authenticateToken, bookController.updateBook); // Update a book
router.delete('/books/:id', authenticateToken, bookController.deleteBook); // Delete a book

module.exports = router;
