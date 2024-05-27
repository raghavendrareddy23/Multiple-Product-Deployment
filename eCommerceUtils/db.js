const mongoose = require('mongoose');
require('dotenv').config();

const connectDBProject1 = async () => {
  try {
    const conn = await mongoose.createConnection(process.env.PROJECT1_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Ecommerce backend MongoDB Connected to Project 1');
    return conn;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDBProject1;
