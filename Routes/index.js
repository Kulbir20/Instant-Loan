
const express = require('express');
const router = express.Router();


router.use("/auth", require("./auth"));
router.use("/instant-loan", require("./instantLoan"));


module.exports = router;
