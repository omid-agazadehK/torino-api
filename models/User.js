const mongoose = require("mongoose");
require("dotenv").config();

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    mobile: { type: String, required: true, unique: true },
    email: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    otpCode: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

// Create Mongoose Model
const User = mongoose.model("User", userSchema);

// Get all users
const getAllUsers = async () => {
  return await User.find();
};

// Get user by ID
const getUserById = async (id) => {
  return await User.findById(id);
};

// Get user by mobile
const getUserByMobile = async (mobile) => {
  return await User.findOne({ mobile });
};

// Create a new user
const createUser = async (userData) => {
  // Check for unique mobile
  const existingUser = await User.findOne({ mobile: userData.mobile });
  if (existingUser) throw new Error("Mobile number must be unique");

  // Validate gender
  if (userData.gender && !["male", "female"].includes(userData.gender)) {
    throw new Error("Gender must be either male or female");
  }

  const newUser = new User({ ...userData, otpExpires: null });
  await newUser.save();
  return newUser;
};

// Update an existing user
const updateUser = async (id, updatedData) => {
  const user = await User.findById(id);
  if (!user) return null;

  // Check mobile uniqueness
  if (updatedData.mobile && updatedData.mobile !== user.mobile) {
    const existingUser = await User.findOne({ mobile: updatedData.mobile });
    if (existingUser) throw new Error("Mobile number must be unique");
  }

  // Validate gender
  if (updatedData.gender && !["male", "female"].includes(updatedData.gender)) {
    throw new Error("Gender must be either male or female");
  }

  Object.assign(user, updatedData);
  await user.save();
  return user;
};

// Delete a user
const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByMobile,
  createUser,
  updateUser,
  deleteUser,
};
