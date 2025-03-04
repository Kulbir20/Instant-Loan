const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const instantLoanSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    pan: {
        type: String,
    },
    aadhar: {
        type: String,
    },
});

instantLoanSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return token;
};

const instantLoan = mongoose.model('InstantLoan', instantLoanSchema);

module.exports = instantLoan;
