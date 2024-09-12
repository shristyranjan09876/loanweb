const Loan = require('../models/Loan');
const Employee = require('../models/Employee');

// Apply for Loan
exports.applyForLoan = async (req, res) => {
    console.log('--- Start of applyForLoan function ---');
    try {
        if (!req.user) {
            console.log('Authentication required: User not authenticated');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userId = req.user._id;
        const { amount, purpose, requestedRepaymentPeriod, tenure } = req.body;

        if (!amount || !purpose || !requestedRepaymentPeriod || !tenure) {
            console.log('Invalid request: Missing fields');
            return res.status(400).json({ error: 'All fields are mandatory: amount, purpose, requestedRepaymentPeriod, and tenure' });
        }

        console.log('Finding employee by userId:', userId);
        const employee = await Employee.findOne({ user: userId });
        if (!employee) {
            console.log('Employee not found for userId:', userId);
            return res.status(404).json({ error: 'Employee not found' });
        }

        console.log('Checking for pending loans for employee:', employee._id);
        const pendingLoans = await Loan.find({ employee: employee._id, status: 'pending' });
        const pendingAmount = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);

        const maxLoanAmount = employee.salary / 2 - pendingAmount;
        if (Number(amount) > maxLoanAmount) {
            console.log('Loan amount exceeds limit. Requested amount:', amount, 'Max allowed:', maxLoanAmount);
            return res.status(400).json({ error: `Loan amount exceeds the limit of ${maxLoanAmount}` });
        }

        console.log('Creating repayment schedule for amount:', amount, 'Requested period:', requestedRepaymentPeriod);
        const repaymentSchedule = [];
        for (let i = 1; i <= requestedRepaymentPeriod; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i);
            repaymentSchedule.push({
                dueDate,
                amount: (Number(amount) / requestedRepaymentPeriod).toFixed(2),
                status: 'pending'
            });
        }

        // Handle file uploads
        const documents = req.files.map(file => file.path);

        console.log('Creating new loan document with documents:', documents);
        const newLoan = new Loan({
            employee: employee._id,
            amount: Number(amount),
            purpose,
            requestedRepaymentPeriod,
            tenure,
            status: 'pending',
            repaymentSchedule,
            documents // Add documents array
        });

        await newLoan.save();

        console.log('Loan application submitted successfully:', newLoan);
        return res.status(201).json({
            message: 'Loan application submitted successfully',
            loan: newLoan
        });
    } catch (error) {
        console.error('Loan application error:', error);
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};



// Get Loan History
exports.loanHistory = async (req, res) => {
    console.log('--- Start of loanHistory function ---');
    try {
        if (!req.user) {
            console.log('Authentication required: User not authenticated');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userId = req.user._id;

        console.log('Finding employee by userId:', userId);
        const employee = await Employee.findOne({ user: userId });
        if (!employee) {
            console.log('Employee not found for userId:', userId);
            return res.status(404).json({ error: 'Employee not found' });
        }

        console.log('Fetching all loans for employee:', employee._id);
        const loans = await Loan.find({ employee: employee._id });

        // Separate loans into categories
        const completedLoans = loans.filter(loan => loan.status === 'completed');
        const pendingLoans = loans.filter(loan => loan.status === 'approved');
        const newApplications = loans.filter(loan => loan.status === 'pending');

        // Format response
        const loanHistory = {
            completedLoans: completedLoans.map(loan => ({
                amount: loan.amount,
                disburseDate: loan.disburseDate,
                closeDate: loan.closeDate
            })),
            pendingLoans: pendingLoans.map(loan => ({
                amount: loan.amount,
                disburseDate: loan.disburseDate,
                tenure: loan.tenure,
                submittedEMI: loan.repaymentSchedule.filter(e => e.status === 'paid').length,
                closeDate: loan.closeDate
            })),
            newApplications: newApplications.map(loan => ({
                amount: loan.amount,
                status: loan.status
            }))
        };

        console.log('Loan history fetched successfully:', loanHistory);
        return res.status(200).json({ loanHistory });
    } catch (error) {
        console.error('Loan history error:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving loan history' });
    }
};

// Get all new loan requests with employee details
exports.getNewLoanRequests = async (req, res) => {
    console.log('--- Start of getNewLoanRequests function ---');
    try {
        // Validate admin authentication
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        console.log('Aggregating new loan requests with employee details');
        // Aggregate loans with employee details
        const newLoanRequests = await Loan.aggregate([
            {
                $match: { status: 'pending' }
            },
            {
                $lookup: {
                    from: 'employees', // The name of the Employee collection
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employeeDetails'
                }
            },
            {
                $unwind: {
                    path: '$employeeDetails',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        console.log('New loan requests fetched successfully:', newLoanRequests);
        res.status(200).json(newLoanRequests);
    } catch (error) {
        console.error('Error fetching new loan requests:', error);
        res.status(500).json({ error: 'An error occurred while fetching new loan requests. Please try again later.' });
    }
};

// Get employee details along with their loans
exports.getEmployeeDetails = async (req, res) => {
    console.log('--- Start of getEmployeeDetails function ---');
    try {
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { employeeId } = req.params;

        console.log('Finding employee by employeeId:', employeeId);
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            console.log('Employee not found for employeeId:', employeeId);
            return res.status(404).json({ error: 'Employee not found' });
        }

        console.log('Aggregating loans for employee:', employeeId);
        // Aggregate loans for the specific employee with details
        const loans = await Loan.aggregate([
            {
                $match: { employee: mongoose.Types.ObjectId(employeeId) }
            },
            {
                $lookup: {
                    from: 'employees', // The name of the Employee collection
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employeeDetails'
                }
            },
            {
                $unwind: {
                    path: '$employeeDetails',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);

        console.log('Employee details and loans fetched successfully:', { employee, loans });
        res.status(200).json({
            employee,
            loans
        });
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ error: 'An error occurred while fetching employee details. Please try again later.' });
    }
};

// Approve or reject a loan
exports.updateLoanStatus = async (req, res) => {
    console.log('--- Start of updateLoanStatus function ---');
    try {
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { loanId, status } = req.body;

        if (!loanId || !status || !['approved', 'rejected'].includes(status)) {
            console.log('Invalid request: Missing or incorrect parameters');
            return res.status(400).json({ error: 'Invalid request' });
        }

        console.log('Finding loan by loanId:', loanId);
        // Find and update the loan status
        const loan = await Loan.findById(loanId);
        if (!loan) {
            console.log('Loan not found for loanId:', loanId);
            return res.status(404).json({ error: 'Loan not found' });
        }

        loan.status = status;
        if (status === 'approved') {
            loan.approvedDate = new Date();
        }
        await loan.save();

        console.log('Loan status updated successfully:', loan);
        res.status(200).json({ message: 'Loan status updated successfully', loan });
    } catch (error) {
        console.error('Error updating loan status:', error);
        res.status(500).json({ error: 'An error occurred while updating the loan status. Please try again later.' });
    }
};
