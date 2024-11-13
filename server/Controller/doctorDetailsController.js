const asyncHandler = require('express-async-handler');
const doctor = require('../Models/doctorDetailsModel');
require('dotenv').config();

const docDetails = asyncHandler(async (req, res) => {
  const { name, speciality, phoneNumber, experience, address } = req.body;
  
  // Check if all fields are provided
  if (!name || !speciality || !phoneNumber || !experience || !address) {
    res.status(400);
    throw new Error('Please provide all fields');
  }

  // Check if doctor already exists
  const doctorExists = await doctor.findOne({ name });
  if (doctorExists) {
    return res.status(400).json({ message: 'Doctor already exists' });
  }

  // Create the doctor entry
  const newDoctor = await doctor.create({
    name,
    speciality,
    phoneNumber,
    experience,
    address
  });

  res.status(201).json({ message: 'Doctor details added successfully', newDoctor });
});

// GET route for retrieving all doctor details
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await doctor.find({});
  res.status(200).json(doctors);
});

module.exports = { docDetails, getDoctors };
