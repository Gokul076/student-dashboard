const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function run(){
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await User.findOne({ email: 'admin@example.com' });
  if (exists) { console.log('admin exists'); process.exit(0); }

  const pwdHash = await bcrypt.hash('password123', 10);

  // create using the field your schema expects (passwordHash)
  await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash: pwdHash, role: 'admin' });
  console.log('admin created');
  process.exit(0);
}

run().catch(e=>{
  console.error(e);
  process.exit(1);
});
