const express = require('express');
const router = express.Router();
const loanController = require('../controllers/LoanController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const multer = require('multer'); // Import multer
const path = require('path');
// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Set the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`); // Set the filename
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Allow only certain file types
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Apply for loan
router.post('/loans', authenticate, upload.array('documents'), loanController.applyForLoan);

// Get loan history
router.get('/loans/history', authenticate,loanController.loanHistory);
// Admin: Get all loans applied by all users (Admin route)
router.get('/admin/loans', authenticate, authorizeAdmin, loanController.getAllLoanApplications);
// Admin: Approve loan (Admin route)
router.get('/admin/loans/approve/:loanId', authenticate, authorizeAdmin, loanController.approveLoan);

// Admin: Reject loan (Admin route)
router.get('/admin/loans/reject/:loanId', authenticate, authorizeAdmin, loanController.rejectLoan);
router.post('/submitEMI/:loanId/:repaymentId',authenticate, loanController.submitEMI);

module.exports = router;
