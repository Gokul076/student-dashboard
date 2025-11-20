// seed.js (run with: node src/seed.js)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@example.com' });
  if (!exists) {
    const pass = await bcrypt.hash('password123', 10);
    await new User({ name: 'Admin', email: 'admin@example.com', passwordHash: pass, role: 'admin' }).save();
    console.log('Seeded admin user: admin@example.com / password123');
  } else console.log('Admin exists');
  process.exit();
}
run().catch(err=>{ console.error(err); process.exit(1); });
