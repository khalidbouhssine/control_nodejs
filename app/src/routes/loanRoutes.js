const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authenticateToken = require('../middlewares/authMiddleware');


// Route to create a new loan
router.post('/loans',authenticateToken, loanController.createLoan);
// Route to return a book (update loan status to "returned")
router.put('/loans/:id',authenticateToken, loanController.returnBook);
// Route to get all loans
router.get('/loans',authenticateToken, loanController.getAllLoans);
// Route to get loans by user
router.get('/loans/user/:userId',authenticateToken, loanController.getLoansByUser);
// Route to get loans by book
router.get('/loans/book/:bookId',authenticateToken, loanController.getLoansByBook);
// Route to update loan status
router.put('/loans/status/:id',authenticateToken, loanController.updateLoanStatus);

module.exports = router;
