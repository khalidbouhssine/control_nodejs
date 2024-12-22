const express = require('express');
const authenticateToken = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes for user management
router.get('/users', authenticateToken, userController.getUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.get('/users/search/:name', authenticateToken, userController.searchUserByName);
router.put('/users/:id', authenticateToken, userController.updateUser);
router.delete('/users/:id', authenticateToken, userController.deleteUser);

// Routes for authentication
router.post('/auth/signup', userController.signUp);
router.post('/auth/login', userController.login);

module.exports = router;
