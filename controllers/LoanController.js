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
            loan: newLoan,
            status:200
        });
    } catch (error) {
        console.error('Loan application error:', error);
        return res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
};



exports.loanHistory = async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Determine if the user is an admin
        const isAdmin = req.user.role === 'admin';

        let loans;
        if (isAdmin) {
            // Admins fetch all loans
            loans = await Loan.find({status:req.query.loanStatus});
        } else {
            // Fetch loans only for the authenticated user
            const userId = req.user._id;

            const employee = await Employee.findOne({ user: userId });
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            loans = await Loan.find({ employee: employee._id,status:req.query.loanStatus });
        }

     
        return res.status(200).json({ loans ,status:200});
    } catch (error) {
        console.error('Loan history error:', error);
        return res.status(500).json({ error: error.message});
    }
};






// Get all loan applications with employee details
exports.getAllLoanApplications = async (req, res) => {
    console.log('--- Start of getAllLoanApplications function ---');
    try {
        // Validate admin authentication
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        // Get loan status from query parameters
        const loanstatus = req.query.loanstatus;

        // Build match condition based on loanstatus
        let matchCondition = {};
        if (loanstatus) {
            matchCondition.status = loanstatus;
        }

        console.log('Aggregating all loan applications with employee details based on loanstatus:', loanstatus);
        const loanApplications = await Loan.aggregate([
            // Apply the match condition if loanstatus is provided
            {
                $match: matchCondition
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
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    status: 1,
                    purpose: 1,
                    requestedRepaymentPeriod: 1,
                    tenure: 1,
                    employeeDetails: {
                        _id: 1,
                        name: 1,
                        salary: 1,
                        user: 1
                    },
                    documents: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        console.log('Loan applications fetched successfully:', loanApplications);
        return res.status(200).json({ loans: loanApplications, status: 200 });
    } catch (error) {
        console.error('Error fetching loan applications:', error);
        return res.status(500).json({ error: 'An error occurred while fetching loan applications. Please try again later.' });
    }
};


// Approve Loan
exports.approveLoan = async (req, res) => {
    console.log('--- Start of approveLoan function ---');
    try {
        // Validate admin authentication
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { loanId } = req.params;

        console.log('Finding loan by loanId:', loanId);
        const loan = await Loan.findById(loanId);
        if (!loan) {
            console.log('Loan not found:', loanId);
            return res.status(404).json({ error: 'Loan not found' });
        }

        if (loan.status !== 'pending') {
            console.log('Loan is not pending:', loanId);
            return res.status(400).json({ error: 'Only pending loans can be approved' });
        }

        loan.status = 'approved';
        loan.disburseDate = new Date();

        await loan.save();

        console.log('Loan approved successfully:', loan);
        return res.status(200).json({ message: 'Loan approved successfully', loan ,status:200 });
    } catch (error) {
        console.error('Loan approval error:', error);
        return res.status(500).json({ error: 'An error occurred while approving the loan' });
    }
};

// Reject Loan
exports.rejectLoan = async (req, res) => {
    console.log('--- Start of rejectLoan function ---');
    try {
        // Validate admin authentication
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { loanId } = req.params;

        console.log('Finding loan by loanId:', loanId);
        const loan = await Loan.findById(loanId);
        if (!loan) {
            console.log('Loan not found:', loanId);
            return res.status(404).json({ error: 'Loan not found' });
        }

        if (loan.status !== 'pending') {
            console.log('Loan is not pending:', loanId);
            return res.status(400).json({ error: 'Only pending loans can be rejected' });
        }

        loan.status = 'rejected';

        await loan.save();

        console.log('Loan rejected successfully:', loan);
        return res.status(200).json({ message: 'Loan rejected successfully', loan ,status:200});
    } catch (error) {
        console.error('Loan rejection error:', error);
        return res.status(500).json({ error: 'An error occurred while rejecting the loan' });
    }
};









// Submit EMI and mark it as paid
exports.submitEMI = async (req, res) => {
    console.log('--- Start of submitEMI function ---');
    try {
        if (!req.user) {
            console.log('Authentication required: User not authenticated');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { loanId, repaymentId } = req.params;

        console.log('Finding loan by loanId:', loanId);
        const loan = await Loan.findById(loanId);
        if (!loan) {
            console.log('Loan not found:', loanId);
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Find the repayment entry
        const repayment = loan.repaymentSchedule.id(repaymentId);
        if (!repayment) {
            console.log('Repayment not found:', repaymentId);
            return res.status(404).json({ error: 'Repayment entry not found' });
        }

        // Update the repayment status to 'paid'
        repayment.status = 'paid';

        // Check if all repayments are paid
        const allPaid = loan.repaymentSchedule.every(entry => entry.status === 'paid');
        if (allPaid) {
            loan.status = 'completed';
            loan.closeDate = new Date(); // Set the close date to now
        }

        await loan.save();

        console.log('EMI submitted successfully:', loan );
        return res.status(200).json({
            message: 'EMI submitted successfully',
            loan,
            status:200
        });
    } catch (error) {
        console.error('EMI submission error:', error);
        return res.status(500).json({ error: 'An error occurred while submitting the EMI' });
    }
};


























































































// Get employee details along with their loans
// exports.getEmployeeDetails = async (req, res) => {
//     console.log('--- Start of getEmployeeDetails function ---');
//     try {
//         if (!req.user || req.user.role !== 'admin') {
//             console.log('Admin access required: User not authorized');
//             return res.status(403).json({ error: 'Admin access required' });
//         }

//         const { employeeId } = req.params;

//         console.log('Finding employee by employeeId:', employeeId);
//         const employee = await Employee.findById(employeeId);
//         if (!employee) {
//             console.log('Employee not found for employeeId:', employeeId);
//             return res.status(404).json({ error: 'Employee not found' });
//         }

//         console.log('Aggregating loans for employee:', employeeId);
//         // Aggregate loans for the specific employee with details
//         const loans = await Loan.aggregate([
//             {
//                 $match: { employee: mongoose.Types.ObjectId(employeeId) }
//             },
//             {
//                 $lookup: {
//                     from: 'employees', // The name of the Employee collection
//                     localField: 'employee',
//                     foreignField: '_id',
//                     as: 'employeeDetails'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$employeeDetails',
//                     preserveNullAndEmptyArrays: true
//                 }
//             }
//         ]);

//         console.log('Employee details and loans fetched successfully:', { employee, loans });
//         res.status(200).json({
//             employee,
//             loans
//         });
//     } catch (error) {
//         console.error('Error fetching employee details:', error);
//         res.status(500).json({ error: 'An error occurred while fetching employee details. Please try again later.' });
//     }
// };


