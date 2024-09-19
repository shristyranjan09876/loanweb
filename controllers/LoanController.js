const Loan = require('../models/Loan');
const Employee = require('../models/Employee');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const dotenv = require('dotenv');
const Interest = require('../models/InterestRate'); // Ensure this path is correct
dotenv.config(); 
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

        // Handle file uploads
        const documents = req.files ? req.files.map(file => file.path) : []; // Check if req.files exists

        console.log('Creating new loan document with documents:', documents);
        const newLoan = new Loan({
            employee: employee._id,
            amount: Number(amount),
            purpose,
            requestedRepaymentPeriod,
            tenure,
            status: 'pending',
            documents
        });

        await newLoan.save();

        console.log('Loan application submitted successfully:', newLoan);
        
        // Respond with loan details
        return res.status(201).json({
            message: 'Loan application submitted successfully',
            loan: newLoan,
            status: 201
        });
    } catch (error) {
        console.error('Loan application error:', error);
        return res.status(500).json({ error: error.message });
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
            loans = await Loan.find({ status: req.query.loanStatus }).exec();
        } else {
            // Fetch loans only for the authenticated user
            const userId = req.user._id;

            // Find the employee associated with the user
            const employee = await Employee.findOne({ user: userId }).exec();
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }

            console.log("Employee ID:", employee._id); // Debug: Verify the employee ID
            // Fetch loans associated with the employee
            loans = await Loan.find({ employee: employee._id, status: req.query.loanStatus }).exec();
        }

        console.log("Loan Status Query:", req.query.loanStatus); // Debug: Verify the status query
        console.log("Loans Returned:", loans); // Debug: Check what loans are returned

        return res.status(200).json({ loans, status: 200 });
    } catch (error) {
        console.error('Loan history error:', error);
        return res.status(500).json({ error: error.message });
    }
};





exports.getSingleLoan = async (req, res) => {
    console.log('--- Start of getSingleLoan function ---');
    try {
        const { loanId } = req.params;
        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin'; // Assuming role is stored in user object

        console.log('User ID:', userId, 'Is Admin:', isAdmin);

        let loan;
        let employeeName = '';

        if (isAdmin) {
            console.log('Admin access: Fetching loan directly');
            // Correcting to firstName and lastName as defined in your schema
            loan = await Loan.findById(loanId).populate('employee', 'firstName lastName');
            
            if (loan && loan.employee) {
                const { firstName = '', lastName = '' } = loan.employee;  // Correct field names
                employeeName = `${firstName} ${lastName}`.trim();  // Combine firstName and lastName
            }
        } else {
            console.log('Employee access: Finding employee by userId:', userId);
            const employee = await Employee.findOne({ user: userId });
            
            if (!employee) {
                console.log('Employee not found for userId:', userId);
                return res.status(404).json({ error: 'Employee not found', status: 404 });
            }

            console.log('Finding loan by loanId:', loanId);
            loan = await Loan.findOne({ _id: loanId, employee: employee._id });
        }

        if (!loan) {
            console.log('Loan not found or not authorized to view this loan:', loanId);
            return res.status(404).json({ error: 'Loan not found or not authorized to view this loan', status: 404 });
        }

        console.log('Loan fetched successfully:', loan);
        
        const response = { loan, status: 200 };
        if (isAdmin && employeeName) {
            response.employeeName = employeeName;
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching single loan:', error);
        return res.status(500).json({ error: error.message, status: 500 });
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
        return res.status(500).json({ error: error.message });
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

        console.log('Finding current interest rate');
        const interest = await Interest.findOne();
        if (!interest) {
            console.log('Interest rate not found');
            return res.status(404).json({ error: 'Interest rate not found' });
        }

        const interestRate = interest.interestRate;
        console.log('Interest rate retrieved:', interestRate);

        // Calculate the total interest using the annual interest rate
        console.log('Calculating annual interest for amount:', loan.amount);

        const annualInterestRate = Number(interestRate) / 100;  // Annual interest rate as a percentage

        // Total interest for the entire tenure (simple interest formula)
        const totalInterest = Number(loan.amount) * annualInterestRate * (loan.tenure / 12);  // Convert tenure to years

        // Calculate monthly repayments with interest
        const totalRepaymentAmount = Number(loan.amount) + totalInterest;  // Principal + total interest
        const monthlyRepayment = (totalRepaymentAmount / loan.requestedRepaymentPeriod).toFixed(2);  // Use requestedRepaymentPeriod for calculation

        const repaymentSchedule = [];
        for (let i = 1; i <= loan.requestedRepaymentPeriod; i++) {
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + i);

            repaymentSchedule.push({
                dueDate,
                amount: monthlyRepayment,
                interest: (totalInterest / loan.requestedRepaymentPeriod).toFixed(2),  // Split total interest equally across all months
                principal: (Number(loan.amount) / loan.requestedRepaymentPeriod).toFixed(2),
                status: 'pending'
            });
        }

        loan.status = 'approved';
        loan.disburseDate = new Date();
        loan.interestAmount = totalInterest.toFixed(2);  // Total interest based on annual rate
        loan.outstandingAmount = totalRepaymentAmount.toFixed(2);  // Principal + total interest
        loan.repaymentSchedule = repaymentSchedule;

        await loan.save();

        console.log('Loan approved successfully:', loan);
        return res.status(200).json({ 
            message: 'Loan approved successfully', 
            loan, 
            totalInterest: totalInterest.toFixed(2),  // Total interest included in the response
            outstandingAmount: totalRepaymentAmount.toFixed(2),  // Outstanding amount included in the response
            status: 200 
        });
    } catch (error) {
        console.error('Loan approval error:', error);
        return res.status(500).json({ error: error.message });
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
        return res.status(500).json({ error: error.message });
    }
};

;


// API to submit an EMI payment
exports.submitEMI = async (req, res) => {
    try {
      const { loanId } = req.params;
      const { repaymentDate, paidAmount } = req.body;
  
      // Validate inputs
      if ((!repaymentDate && !paidAmount) || !paidAmount) {
        return res.status(400).json({ message: 'paidAmount is required' });
      }
  
      // Find the loan
      let loan = await Loan.findById(loanId);
      if (!loan) {
        return res.status(404).json({ message: 'Loan not found' });
      }
  
      let remainingPayment = paidAmount;
      let installment;
  
      // Check if specific installment repayment is being made
      if (repaymentDate) {
        installment = loan.repaymentSchedule.find(inst => inst.dueDate.toISOString().split('T')[0] === repaymentDate);
        if (!installment) {
          return res.status(404).json({ message: 'No installment found for the given repaymentDate' });
        }
  
        // Update the installment based on paid amount
        let dueAmount = installment.amount - installment.paidAmount;
        if (remainingPayment >= dueAmount) {
          installment.paidAmount += dueAmount;
          installment.status = 'paid';
          remainingPayment -= dueAmount;
        } else {
          installment.paidAmount += remainingPayment;
          installment.status = 'partially paid';
          remainingPayment = 0;
        }
        installment.overdueAmount = installment.amount - installment.paidAmount;
      }
  
      // If any remaining payment is left, apply it to overdue amounts
      if (remainingPayment > 0) {
        for (let inst of loan.repaymentSchedule) {
          if (inst.overdueAmount > 0) {
            let dueAmount = inst.overdueAmount;
            if (remainingPayment >= dueAmount) {
              inst.paidAmount += dueAmount;
              inst.overdueAmount = 0;
              inst.status = 'paid';
              remainingPayment -= dueAmount;
            } else {
              inst.paidAmount += remainingPayment;
              inst.overdueAmount -= remainingPayment;
              inst.status = 'partially paid';
              remainingPayment = 0;
            }
          }
        }
      }
  
      // Calculate total overdue and remaining amounts
      let totalOverdueAmount = 0;
      let totalRemainingAmount = 0;
  
      for (let inst of loan.repaymentSchedule) {
        totalOverdueAmount += inst.overdueAmount;
        totalRemainingAmount += inst.amount - inst.paidAmount;
      }
  
      // Round the amounts to avoid precision errors
      totalOverdueAmount = parseFloat(totalOverdueAmount.toFixed(2));
      totalRemainingAmount = parseFloat(totalRemainingAmount.toFixed(2));
  
      // Update loan status if fully paid
      if (totalRemainingAmount === 0 && totalOverdueAmount === 0) {
        loan.status = 'completed';
        loan.closeDate = new Date();
      }
  
      // Save the updated loan
      await loan.save();
  
      // Send response with complete loan details
      res.json({
        loan,
        totalOverdueAmount,
        totalRemainingAmount,
        status: loan.status,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  
  



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Function to send email notification
const sendEmail = async (email, loanId) => {
    console.log('Attempting to send email');
    console.log('Email Username:', process.env.EMAIL_USERNAME);
    console.log('Email Password:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Loan Closed Notification',
        text: `Your loan with ID: ${loanId} has been successfully closed. Congratulations!`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};
// Controller to handle loan status update
exports.updateLoanStatus = async (req, res) => {
    console.log('--- Start of updateLoanStatus function ---');
    try {
        const loanId = req.params.id;
        const { status } = req.body;

        // Validate admin authentication
        if (!req.user || req.user.role !== 'admin') {
            console.log('Admin access required: User not authorized');
            return res.status(403).json({ error: 'Admin access required' });
        }

        console.log('Finding loan by loanId:', loanId);
        const loan = await Loan.findById(loanId);
        if (!loan) {
            console.log('Loan not found:', loanId);
            return res.status(404).json({ error: 'Loan not found' });
        }

        // Update loan status if it's valid (approved, rejected, completed, etc.)
        loan.status = status;
        if (status === 'completed') {
            loan.closeDate = new Date(); // Set the close date for completed loans
        }

        await loan.save();

        console.log('Loan status updated successfully:', loan);

        // If the loan is completed, send an email to the user
        if (status === 'completed') {
            console.log('Loan marked as completed. Sending email notification...');
            const employee = await Employee.findById(loan.employee);
            if (!employee) {
                console.log('Employee not found for loan:', loanId);
                return res.status(404).json({ error: 'Employee not found' });
            }
            
            const user = await User.findById(employee.user);
            if (user) {
                await sendEmail(user.email, loanId);
            }
        }

        return res.status(200).json({ message: 'Loan status updated successfully', loan, status: 200 });
    } catch (error) {
        console.error('Error updating loan status:', error);
        return res.status(500).json({ error: error.message });
    }
};