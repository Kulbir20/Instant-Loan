const express=require('express');
const router=express.Router();
const InstantLoanController=require('../Controllers/instantLoan');
const verifyToken = require('../middleware/Auth');

router.post('/applyLoan',InstantLoanController.applyLoan);
router.post('/generatepresignedurl',verifyToken,InstantLoanController.generatePresignedUrl);

module.exports=router;