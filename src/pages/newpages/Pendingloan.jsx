import React from 'react';
//import './pending.css'

const Pendingloan = () => {
  const pendingLoans = [
    { amount: '100000', disbursementDate: '2024-01-15', tenure: 12, submittedEmi: '2/12', closeDate: '2025-01-15' },
    { amount: '70000', disbursementDate: '2023-12-10', tenure: 10, submittedEmi: '1/10', closeDate: '2024-10-10' }
  ];

  return (
    <div className="loan-container">
      <h2 className="loan-title">Pending Loans</h2>
      <table className="loan-table">
        <thead>
          <tr>
            <th>Loan Amount</th>
            <th>Disbursement Date</th>
            <th>Tenure (Months)</th>
            <th>Submitted EMI</th>
            <th>Close Date</th>
          </tr>
        </thead>
        <tbody>
          {pendingLoans.map((loan, index) => (
            <tr key={index} className="loan-row">
              <td>${loan.amount}</td>
              <td>{loan.disbursementDate}</td>
              <td>{loan.tenure}</td>
              <td>{loan.submittedEmi}</td>
              <td>{loan.closeDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pendingloan;
