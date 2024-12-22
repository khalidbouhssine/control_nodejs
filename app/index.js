const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/dbConfig'); // This path should be correct
const userRoutes = require('./src/routes/userRoutes'); // Import user routes
const bookRoutes = require('./src/routes/bookRoutes'); // Import book routes
const loanRoutes = require('./src/routes/loanRoutes'); // Import loan routes


const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Test the database connection
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synced successfully (force).');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });


// Use the user routes for /users and authentication routes
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', loanRoutes);


// Test root route
app.get('/', (req, res) => {
  res.send('Welcome to the User Management API');
});

// Define the server port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
