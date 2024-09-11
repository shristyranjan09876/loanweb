const express = require('express');
const router = express.Router();
const loanController = require('../controllers/LoanController');
const { authenticate } = require('../middlewares/auth');

router.post('/loans/apply',authenticate, loanController.applyForLoan);

module.exports = router;
