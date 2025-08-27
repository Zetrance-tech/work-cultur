/*
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import  jwt  from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Connect to your local DB
mongoose.connect(process.env.MONGODB_URI || '', {
  dbName: 'Skillsparc',
}).then(() => {
  console.log('Connected to DB');
}).catch(console.error);

// Import your user model (adjust the path to match your structure)
import UserModel from '../src/models/user.model';

// Main function
async function createAdmin() {
  const email = 'suraj@gmail.com';
  const password = '123';

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create admin
  const newAdmin = await UserModel.create({
    name: 'suraj',
    email,
    password: hashedPassword,
    accountType: 'admin',
  }) as any;

  console.log('Admin created:', newAdmin.email);
  const token = generateToken(newAdmin._id.toString(), newAdmin.email, newAdmin.accountType);
  console.log('Token:', token);
}

// Token generator
function generateToken(userId: string, email: string, accountType: string) {
  const payload = { userId, email, accountType };
  const secret = process.env.ACCESS_TOKEN_SECRET || 'fallbacksecret';
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || '1d';
  const token = jwt.sign(payload, secret, { expiresIn });

  return token;
}

createAdmin();
*/