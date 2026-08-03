require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foryou';
    await mongoose.connect(mongoUri);
    console.log(`[Seed Script] Connected to database...`);

    const email = (process.argv[2] || 'admin@foryou.com').toLowerCase();
    const password = process.argv[3] || 'Admin@123456';

    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.passwordHash = password;
      await admin.save();
      console.log(`[Seed Script] Updated existing admin user: ${email}`);
    } else {
      admin = await Admin.create({ email, passwordHash: password });
      console.log(`[Seed Script] Created new admin user: ${email}`);
    }

    console.log(`----------------------------------------`);
    console.log(`Admin Email: ${email}`);
    console.log(`Admin Password: ${password}`);
    console.log(`----------------------------------------`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Script Error] ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
