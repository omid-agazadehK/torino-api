// Find or create user
let user = await User.getUserByMobile(mobile);
if (!user) {
  user = await User.createUser({ mobile });
} else {
  // Update existing user
  user = await User.updateUser(user._id, { mobile });
}

// Update OTP and expiration
const updatedUser = await User.updateUser(user._id, {
  otpCode,
  otpExpires: Date.now() + 10 * 60 * 1000,
});

// Generate tokens
const accessToken = jwt.sign(
  { id: user._id, mobile: user.mobile },
  JWT_SECRET,
  { expiresIn: "1h" }
);
const refreshToken = jwt.sign(
  { id: user._id, mobile: user.mobile },
  JWT_SECRET,
  { expiresIn: "7d" }
);
