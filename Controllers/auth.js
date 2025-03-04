const InstantLoan = require('../models/instantLoan');
const OTP = require('../Models/otp');

exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;
    if (!phoneNumber && !email) {
      return res.status(400).json({ message: 'phoneNumber or email is required' });
    }

    const query = phoneNumber ? { contactNumber: phoneNumber } : { email: email };
    const user = await InstantLoan.findOneAndUpdate(query, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

    const otpCode = 1234
    

    const otp=new OTP({ userId: user._id, otpCode, expiresAt: Date.now() + 5 * 60 * 1000 });
    await otp.save();
    
    res.status(200).json({ message: 'OTP sent successfully', userId: user._id });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otpCode } = req.body;


    const otpRecord = await OTP.findOne({ userId, otpCode });

   
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

 
    await OTP.findByIdAndDelete(otpRecord._id);

    const user = await InstantLoan.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Authentication successful',
      userId: user._id,
      isNewUser: !user.fullName || !user.email, 
      ...(user.fullName && user.email && { token: user.generateAuthToken() }),
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
