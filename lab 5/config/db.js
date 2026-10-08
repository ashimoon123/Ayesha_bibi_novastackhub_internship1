const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const seedUsers = [
  { name: 'Super Admin', email: 'superadmin@enterprise.com', password: 'SuperAdmin@123', role: 'SuperAdmin', provider: 'local' },
  { name: 'Manager User', email: 'manager@enterprise.com', password: 'Manager@123', role: 'Manager', provider: 'local' },
  { name: 'Employee User', email: 'employee@enterprise.com', password: 'Employee@123', role: 'Employee', provider: 'local' },
];

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    let isMemory = false;

    // Check if URI is default dummy or missing
    if (!mongoUri || mongoUri.includes('<username>')) {
      console.log('No valid MONGO_URI found, starting in-memory MongoDB for local testing...');
      isMemory = true;
      
      const dbPath = path.join(__dirname, '..', '.mongo-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const mongod = await MongoMemoryServer.create({
        instance: { dbPath: dbPath }
      });
      mongoUri = mongod.getUri();
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed for in-memory database
    if (isMemory) {
      console.log('Seeding in-memory database with test credentials...');
      await User.deleteMany({});
      for (const userData of seedUsers) {
        const user = new User(userData);
        await user.save();
      }
      console.log('Seeding complete. Test credentials active.');
    }
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
