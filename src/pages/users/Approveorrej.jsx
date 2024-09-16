import React from 'react';

const Approveorrej = () => {
  
  const loanRequests = [
    {
      id: 1,
      employeeName: 'Shri',
      previousLoan: '$5,0000',
      loanAmount: '$10,0000',
      employeeEmail: 'shri@example.com',
      tenure: '12 months',
    },
    {
      id: 2,
      employeeName: 'ranjan',
      previousLoan: '$2,0000',
      loanAmount: '$5,0000',
      employeeEmail: 'ranjan@example.com',
      tenure: '6 months',
    },
  ];

  const handleApprove = (id) => {
    alert(`Loan request ${id} approved`);
  };

  const handleReject = (id) => {
    alert(`Loan request ${id} rejected`);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Loan Requests</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Previous Loan</th>
            <th>Loan Amount</th>
            <th>Employee Email</th>
            <th>Tenure</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loanRequests.map((loan) => (
            <tr key={loan.id}>
              <td>{loan.employeeName}</td>
              <td>{loan.previousLoan}</td>
              <td>{loan.loanAmount}</td>
              <td>{loan.employeeEmail}</td>
              <td>{loan.tenure}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleApprove(loan.id)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReject(loan.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Approveorrej;
