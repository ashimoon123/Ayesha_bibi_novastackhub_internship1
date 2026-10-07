require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = [
  {
    name: 'Super Admin',
    email: 'superadmin@enterprise.com',
    password: 'SuperAdmin@123',
    role: 'SuperAdmin',
    provider: 'local',
  },
  {
    name: 'Manager User',
    email: 'manager@enterprise.com',
    password: 'Manager@123',
    role: 'Manager',
    provider: 'local',
  },
  {
    name: 'Employee User',
    email: 'employee@enterprise.com',
    password: 'Employee@123',
    role: 'Employee',
    provider: 'local',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users.');

    // Create seed users (passwords are hashed by the pre-save hook)
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created ${user.role}: ${user.email}`);
    }

    console.log('\nSeeding complete! Test credentials:');
    console.log('──────────────────────────────────────');
    seedUsers.forEach((u) => {
      console.log(`${u.role.padEnd(12)} | ${u.email.padEnd(30)} | ${u.password}`);
    });
    console.log('──────────────────────────────────────');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
