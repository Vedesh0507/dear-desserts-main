const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User } = require('../models');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const resetPassword = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in .env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@deardesserts.com';
    const newPassword = 'Vedesh0507';

    const user = await User.findOne({ email: adminEmail });
    if (!user) {
      console.error(`User with email ${adminEmail} not found`);
      process.exit(1);
    }

    user.password = newPassword;
    await user.save();

    console.log(`✅ Password for ${adminEmail} has been updated to: ${newPassword}`);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

resetPassword();
