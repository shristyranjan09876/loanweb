import React from 'react';
import './newap.css'

const Newapply = () => {
  const newApplications = [
    { amount: '20000', status: 'Pending' },
    { amount: '15000', status: 'Approved' }
  ];

  return (
    <div className="loan-container">
      <h2 className="loan-title">New Loan Applications</h2>
      <table className="loan-table">
        <thead>
          <tr>
            <th>Loan Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {newApplications.map((application, index) => (
            <tr key={index} className={application.status === 'Pending' ? 'pending' : 'approved'}>
              <td>${application.amount}</td>
              <td>{application.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Newapply;
