const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    appliedDate: { type: Date, default: Date.now },
    approvedDate: { type: Date },
    disburseDate: { type: Date },
    closeDate: { type: Date },
    tenure: { type: Number, required: true }
});

const Loan = mongoose.model('Loan', LoanSchema);

module.exports = Loan;  
