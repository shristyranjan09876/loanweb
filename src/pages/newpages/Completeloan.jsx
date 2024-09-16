import React from 'react';
import './CompleteLoan.css'; 

const CompleteLoan = () => {
  const completeLoans = [
    { amount: '50000', disbursementDate: '2023-01-01', closeDate: '2023-12-01' },
    { amount: '30000', disbursementDate: '2023-02-15', closeDate: '2024-02-15' }
  ];

  return (
    <div className="loan-container">
      <h2 className="loan-title">Complete Loans</h2>
      <table className="loan-table">
        <thead>
          <tr>
            <th>Loan Amount</th>
            <th>Disbursement Date</th>
            <th>Close Date</th>
          </tr>
        </thead>
        <tbody>
          {completeLoans.map((loan, index) => (
            <tr key={index} className="loan-row">
              <td>${loan.amount}</td>
              <td>{loan.disbursementDate}</td>
              <td>{loan.closeDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompleteLoan;
