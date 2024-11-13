const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = asyncHandler(async (req, res) => {
  const {
    email,
    first_name,
    last_name,
    age,
    blood_group,
    gender,
    phone_number,
    password
  } = req.body;

  // Check if all fields are provided
  if (
    !email || 
    !first_name || 
    !last_name || 
    !age || 
    !blood_group || 
    !gender || 
    !phone_number || 
    !password
  ) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    email,
    first_name,
    last_name,
    age,
    blood_group,
    gender,
    phone_number,
    password: hashedPassword
  });
  res.status(201).json({ message: 'User registered successfully', user });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  // Successful login response
  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    }
  });
});

const getuserprofile = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
      blood_group: user.blood_group,
      gender: user.gender,
      phone_number: user.phone_number
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { registerUser, loginUser, getuserprofile };
