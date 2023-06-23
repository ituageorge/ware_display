const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    });
    console.log(`MongoDB connected: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDatabase;
