const Loan = require('../models/loanModel');
const User = require('../models/userModel');
const Book = require('../models/bookModel');

// Create a new loan
const createLoan = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    // Check if user and book exist
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Create the loan
    const newLoan = await Loan.create({
      userId,
      bookId,
    });

    res.status(201).json({ message: 'Loan created successfully', loan: newLoan });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Error creating loan', error: error.message });
  }
};

// Return a book and update the loan status
const returnBook = async (req, res) => {
  try {
    const { id } = req.params;  // Loan ID
    const returnDate = new Date();  // Set the current date as return date

    // Find the loan by ID
    const loan = await Loan.findByPk(id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Update the loan with the return date and status
    loan.returnDate = returnDate;
    loan.status = 'returned';
    await loan.save();

    res.status(200).json({ message: 'Book returned successfully', loan });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

// Get all loans (optional: filter by user or book)
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: Book, attributes: ['id', 'title', 'author'] }
      ]
    });

    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

// Get loans by user
const getLoansByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const loans = await Loan.findAll({
        where: { userId },
        include: [
          { model: Book, attributes: ['id', 'title', 'author'] }
        ]
      });
  
      res.status(200).json(loans);
    } catch (error) {
      console.error('Error fetching loans for user:', error);
      res.status(500).json({ message: 'Error fetching loans', error: error.message });
    }
  };

// Get loans by book
const getLoansByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const loans = await Loan.findAll({
      where: { bookId },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loans for book:', error);
    res.status(500).json({ message: 'Error fetching loans', error: error.message });
  }
};

// Update loan status (e.g., mark as returned)
const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.status = status; // Update the status (borrowed, returned)
    if (status === 'returned') {
      loan.returnDate = new Date(); // Set return date when returned
    }

    await loan.save();

    res.status(200).json({ message: 'Loan status updated', loan });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ message: 'Error updating loan status', error: error.message });
  }
};

module.exports = {
  createLoan,
  returnBook,
  getAllLoans,
  getLoansByUser,
  getLoansByBook,
  updateLoanStatus,
};
