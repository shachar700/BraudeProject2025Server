// singleton mongoose connection, with uri from .env

// ## check if require(...) type import is singleton - yes it is

const mongoose = require('mongoose');

function connectToDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGO_URI not set in .env');
    process.exit(1);
  }

  mongoose.connect(uri);

  mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });
}

module.exports = connectToDB;