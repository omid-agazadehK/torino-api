const User = require('../models/User'); // Adjusted for JSON-based model
const jwt = require('jsonwebtoken');


// Environment Variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Send OTP Controller
export const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    return res.status(400).json({ message: 'شماره موبایل را به درستی وارد کنید!' });
  }

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    let user = await User.getUserByMobile(mobile);
    if (!user) {
      user = await User.createUser({ mobile });
    }

    // Update OTP and expiration
    const updatedUser = await User.updateUser(user._id, {
      otpCode,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    console.log(`OTP for ${mobile} is ${otpCode}`);

    res.json({ message: 'کد اعتبارسنجی ارسال شد.', code: otpCode });
  } catch (error) {
    console.error('Error in sendOtp:', error.message);
    res.status(500).json({ message: 'خطا در ارسال کد اعتبارسنجی.' });
  }
};

// Check OTP Controller
export const checkOtp = async (req, res) => {
  const { mobile, code } = req.body;
  if (!mobile || !code) {
    return res.status(400).json({ message: 'لطفاً شماره موبایل و کد را وارد کنید!' });
  }

  try {
    const user = await User.getUserByMobile(mobile);
    if (!user) {
      return res.status(400).json({ message: 'کاربری با این شماره تماس وجود ندارد!' });
    }

    if (user.otpCode !== code || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'کد وارد شده فاقد اعتبار است!' });
    }

    const accessToken = jwt.sign({ id: user._id, mobile: user.mobile }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, mobile: user.mobile }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error('Error in checkOtp:', error.message);
    res.status(500).json({ message: 'خطا در بررسی کد اعتبارسنجی.' });
  }
};

// Refresh Token Controller
export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'خطای دسترسی، مجددا وارد شوید!' });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, userData) => {
    if (err) {
      return res.status(403).json({ message: 'خطای دسترسی، مجددا وارد شوید!' });
    }

    const accessToken = jwt.sign({ id: userData.id, mobile: userData.mobile }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
  });
};
