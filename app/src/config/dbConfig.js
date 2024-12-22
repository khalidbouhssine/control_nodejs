const { Sequelize } = require('sequelize');

// Load environment variables (if needed, remove this line if not using .env)
// require('dotenv').config();

// Database configuration
const sequelize = new Sequelize('nodedb', 'khalid', 'root1234', {
  host: 'mysql-db', // or your database server host
  dialect: 'mysql',  // Use the dialect of your database (e.g., 'mysql', 'postgres')
  logging: false,    // Disable logging; set to true if you want to debug queries
  pool: {
    max: 5,          // Maximum number of connections in the pool
    min: 0,          // Minimum number of connections in the pool
    acquire: 30000,  // Maximum time (ms) to try to get a connection before throwing an error
    idle: 10000,     // Maximum time (ms) a connection can be idle before being released
  },
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
