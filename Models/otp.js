const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema=new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => Date.now() + 5 * 60 * 1000, 
    },
  },
  { timestamps: true }
);

mongoose.model('OTP', otpSchema);


