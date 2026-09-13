const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("username:password")) {
    console.warn("MongoDB Notice: MONGO_URI contains placeholder or is unset. Provide your MongoDB connection string in server/.env to enable database features.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn("Backend API is running. If using a local or Atlas database, verify connection settings.");
  }
};

module.exports = connectDB;

