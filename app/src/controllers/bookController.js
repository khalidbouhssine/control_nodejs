const Book = require('../models/bookModel');
const { Op } = require('sequelize');  // Add this line at the top


const createBook = async (req, res) => {
    try {
      // Use the correct field names that match the model
      const { title, author, genre, year } = req.body;
  
      // Check if all required fields are present
      if (!title || !author || !genre || !year) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Create the new book entry
      const newBook = await Book.create({
        title,
        author,
        genre,
        year,  // Corrected field name
      });
  
      // Respond with the created book
      res.status(201).json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ message: 'Error creating book', error: error.message });
    }
  };
  

// Controller to get all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// Controller to get a book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ message: 'Error fetching book by ID', error: error.message });
  }
};

// Controller to search books by title, author, or genre
const searchBooks = async (req, res) => {
  const { query } = req.params;

  try {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { genre: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found matching the search criteria' });
    }

    res.status(200).json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ message: 'Error searching books', error: error.message });
  }
};

// Controller to update a book by ID
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publicationYear, availableCopies } = req.body;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.publicationYear = publicationYear || book.publicationYear;
    book.availableCopies = availableCopies || book.availableCopies;

    await book.save();

    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Controller to delete a book by ID
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  searchBooks,
  updateBook,
  deleteBook,
};
