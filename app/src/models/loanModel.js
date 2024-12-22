const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Path to your database configuration
const User = require('./userModel');  // Assuming you have a User model
const Book = require('./bookModel');  // Assuming you have a Book model

// Define the Loan model
const Loan = sequelize.define('Loan', {
  // A user can borrow a book
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Refers to the User model
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Book, // Refers to the Book model
      key: 'id'
    }
  },
  loanDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW, // Default to current date
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true, // Optional, user might not have returned the book yet
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'borrowed', // Default status is borrowed
    validate: {
      isIn: [['borrowed', 'returned']] // Can either be 'borrowed' or 'returned'
    }
  }
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

// Set up associations
Loan.belongsTo(User, { foreignKey: 'userId' }); // A loan belongs to one user
Loan.belongsTo(Book, { foreignKey: 'bookId' }); // A loan belongs to one book

module.exports = Loan;
