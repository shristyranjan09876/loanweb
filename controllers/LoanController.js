const Loan = require('../models/Loan');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

exports.applyForLoan = async (req, res) => {
    console.log('--- Start of applyForLoan function ---');
    try {
        console.log('Request body:', req.body);
        console.log('Request user:', req.user);

        if (!req.user) {
            console.log('No user found in request');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const userId = req.user._id;
        console.log('User ID from token:', userId);

        const { amount, purpose, tenure } = req.body;
        console.log('Loan details:', { amount, purpose, tenure });
        
        if (!amount || !purpose || !tenure) {
            console.log('Missing required fields');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let employee;
        try {
            console.log('Querying database for employee');
            employee = await Employee.findOne({ user: userId });
            console.log('Employee found:', employee);
        } catch (error) {
            console.error('Error finding employee:', error);
            return res.status(500).json({ error: 'Error finding employee' });
        }

        if (!employee) {
            console.log('No employee found for user ID:', userId);
            return res.status(404).json({ error: 'Employee not found' });
        }

        console.log('Querying for pending loans');
        const pendingLoans = await Loan.find({ employee: employee._id, status: 'pending' });
        console.log('Pending loans:', pendingLoans);

        const pendingAmount = pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
        console.log('Total pending loan amount:', pendingAmount);

        const maxLoanAmount = employee.salary / 2 - pendingAmount;
        console.log('Max loan amount:', maxLoanAmount);

        if (Number(amount) > maxLoanAmount) {
            console.log('Loan amount exceeds limit');
            return res.status(400).json({ error: 'Loan amount exceeds limit' });
        }

        console.log('Creating new loan document');
        const newLoan = new Loan({
            employee: employee._id,
            amount: Number(amount),
            purpose,
            tenure: Number(tenure),
            status: 'pending'
        });
        console.log('New loan document:', newLoan);

        console.log('Saving new loan to database');
        await newLoan.save();
        console.log('Loan saved successfully');

        console.log('Sending success response');
        res.status(201).json({ message: 'Loan application submitted successfully', loan: newLoan });
    } catch (error) {
        console.error('Loan application error:', error);
        res.status(500).json({ error: error.message });
    }
    console.log('--- End of applyForLoan function ---');
};