const mongoose = require('mongoose');
require('dotenv').config();

const connectDBProject2 = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.PROJECT2_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected to Stores DB');
    return conn;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDBProject2;
