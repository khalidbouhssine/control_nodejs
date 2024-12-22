const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { Op } = require('sequelize');



// Function to get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Function to get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findByPk(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Function to search for users by name
const searchUserByName = async (req, res) => {
    const { name } = req.params;
  
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${name}%` } },
            { lastName: { [Op.like]: `%${name}%` } }
          ]
        }
      });
  
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      res.status(200).json(users);
    } catch (error) {
      console.error('Error searching users:', error); // Log detailed error
      res.status(500).json({ message: 'Error searching users', error: error.message });
    }
};
  
  

// Function to update a user by ID
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, school } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.school = school;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Function to delete a user by ID
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

// Function for user sign-up
const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
  
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
  
      // Create new user
      const newUser = await User.create({ firstName, lastName, email, password });
  
      // Generate JWT token
      const token = jwt.sign({ id: newUser.id, email: newUser.email }, 'your_jwt_secret', { expiresIn: '1h' });
  
      // Return success response
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        },
        token
      });
    } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  };
  
  // Function for user login
  const login = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }
  
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare password with the hashed password in database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, 'd5ff7e4e9f4c4a48a8f6a58b6357c1c8', { expiresIn: '1h' });
  
      // Return success response with token
      res.status(200).json({
        message: 'Login successful',
        token
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
  };

module.exports = {
  getUsers,
  getUserById,
  searchUserByName,
  updateUser,
  deleteUser,
  signUp,
  login
};
