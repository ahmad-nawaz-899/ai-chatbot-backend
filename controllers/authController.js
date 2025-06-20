
// backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration Error:', err); // ✅ Log full error
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login Error:', err); // ✅ Log full error
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Get all users (no passwords)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Get Users Error:', err); // ✅ Log full error
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err); // ✅ Log full error
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};
