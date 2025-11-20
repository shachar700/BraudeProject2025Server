// singleton mongoose connection, with uri from .env

// ## require(...) type import is singleton due to caching

const mongoose = require('mongoose');
const config = require('../../../config');

class DB_Service {
  static instance = null;
  connection = null;

  constructor() {
    if (DB_Service.instance) {
      return DB_Service.instance;
    }
    DB_Service.instance = this;
  }

  static getInstance() {
    if (!DB_Service.instance) {
      DB_Service.instance = new DB_Service();
    }
    return DB_Service.instance;
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    const uri = config.mongo.uri;
    if (!uri) {
      throw new Error('❌ MONGODB_URI is not defined in environment variables.');
    }

    try {
      await mongoose.connect(uri);
      this.connection = mongoose.connection;
      this.connection.once('open', () => {
        console.log('✅ Mongoose connection established');
      });
      return this.connection;
    } catch (error) {
      console.error('❌ Error connecting to MongoDB using Mongoose:', error);
      throw error;
    }
  }

  getConnection() {
    if (!this.connection) {
      throw new Error('Mongoose connection is not established yet.');
    }
    return this.connection;
  }

  async close() {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('Mongoose connection closed');
      this.connection = null;
    }
  }
}

module.exports = DB_Service;
