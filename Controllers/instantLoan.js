const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const InstantLoan = require('../models/instantLoan');

exports.applyLoan = async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, email, dob,documents } = req.body;

        const requiredFields = ['firstName', 'lastName', 'contactNumber', 'email', 'dob'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `The following fields are required: ${missingFields.join(', ')}`
            });
        }

        const instantLoan = new InstantLoan({
            firstName,
            lastName,
            contactNumber,
            email,
            dob,
            documents
        });
        await instantLoan.save();

        const token = instantLoan.generateAuthToken(); 

        res.status(200).json({
            message: 'Loan application submitted successfully',
            userId: instantLoan._id, 
            token
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

exports.generatePresignedUrl = async (req, res) => {
    try {
        const { fileType, documentType } = req.body;
        
        if (!fileType || !documentType) {
            return res.status(400).json({ message: 'File type and document type are required' });
        }

        const user = req.user;
        
        const counter = user._id.toString().slice(-6);  
        const documentS3Key = `instantLoan/${user.firstName}_${user.lastName}_${counter}/${documentType}`;
        const encodedKey = encodeURIComponent(documentS3Key);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: documentS3Key,
            Expires: 1200,  
            ContentType: fileType, 
            ACL: 'public-read'  
        };

        const url = await s3.getSignedUrlPromise('putObject', params);
        res.status(200).json({
            url,
            key: encodedKey
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating presigned URL', error: err.message });
    }
};
