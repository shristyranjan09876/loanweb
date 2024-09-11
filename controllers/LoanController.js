// const Loan = require('../models/Loan');
// const Employee = require('../models/Employee');






// exports.applyForLoan = async (req, res) => {
//     try {
//       const { amount, purpose, tenure } = req.body;
//       const employeeId = req.user.id;
  
//       const employee = await Employee.findOne({ user: employeeId });
//       if (!employee) {
//         return res.status(404).json({ error: 'Employee not found' });
//       }
  
//       const pendingLoans = await Loan.find({ employee: employee._id, status: 'pending' });
//       const pendingAmount = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
//       const maxLoanAmount = employee.salary / 2 - pendingAmount;
  
//       if (amount > maxLoanAmount) {
//         return res.status(400).json({ error: 'Loan amount exceeds limit' });
//       }
  
//       const newLoan = new Loan({
//         employee: employee._id,
//         amount,
//         purpose,
//         tenure,
//         status: 'pending'
//       });
  
//       await newLoan.save();
  
//       res.status(201).json({ message: 'Loan application submitted successfully', loan: newLoan });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };

  











// exports.applyForLoan = async (req, res) => {
//   try {
//     const { amount, purpose, requestedRepaymentPeriod } = req.body;
//     const employee = await Employee.findOne({ user: req.user._id });
//     if (!employee) {
//       return res.status(404).json({ error: 'Employee profile not found' });
//     }
//     const loan = new Loan({
//       employee: employee._id,
//       amount,
//       purpose,
//       requestedRepaymentPeriod,
//     });
//     await loan.save();
//     res.status(201).json(loan);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };










// exports.applyForLoan = async (req, res) => {
//     try {
//       const { amount, purpose, repaymentPeriod } = req.body;
//       const employeeId = req.user.employeeProfile;
  
//       const employee = await Employee.findById(employeeId);
//       if (!employee) {
//         return res.status(404).json({ error: 'Employee not found' });
//       }
  
//       // TODO: Implement loan eligibility check based on salary, tenure, etc.
//       const isEligible = true; // Placeholder for eligibility check
  
//       if (!isEligible) {
//         return res.status(400).json({ error: 'Not eligible for loan' });
//       }
  
//       const newLoan = new Loan({
//         employee: employeeId,
//         amount,
//         purpose,
//         repaymentPeriod,
//         status: 'pending'
//       });
  
//       await newLoan.save();
//       res.status(201).json({ message: 'Loan application submitted', loan: newLoan });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   };











  
//     const { amount, tenure } = req.body;
//     const employee = await User.findById(req.user.id);
//     const pendingLoans = await Loan.find({ employee: req.user.id, status: 'pending' });
//     const pendingAmount = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
    
//     const maxLoanAmount = employee.salary / 2 - pendingAmount;
    
//     if (amount > maxLoanAmount) {
//       return res.status(400).json({ message: 'Loan amount exceeds limit' });
//     }
  
//     const newLoan = new Loan({ employee: req.user.id, amount, tenure, status: 'pending' });
//     await newLoan.save();
    
//     res.json({ message: 'Loan application submitted successfully' });
//   });
  