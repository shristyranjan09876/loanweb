import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../../newpages/CompleteLoan.css'
import moment from 'moment';

const CompleteLoan = () => {
  const [loanStatus] = useState('completed'); 
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        setLoading(true); 
        const response = await axios.get(
          `http://localhost:3000/api/loans/history?loanStatus=${loanStatus}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('token'),
            },
          }
        );
        const loans = response.data.loans;
        console.log(response.data.loans);
        setLoanRequests(Array.isArray(loans) ? loans : []); 
        setLoading(false); 
      } catch (error) {
        setError('Failed to load loan requests');
        setLoading(false); 
      }
    };

    fetchLoanHistory();
  }, [loanStatus]);

  return (
    <div className="loan-container">
      <h2 className="loan-title">Complete Loans</h2>

      {loading ? (
        <p>Loading loan data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : loanRequests.length === 0 ? (
        <p>No complete loan records available.</p>
      ) : (
        <table className="loan-table">
          <thead>
            <tr>
              <th>Loan Amount</th>
              <th>Applied Date</th>
              <th>Purpose</th>
              <th>Tenure</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loanRequests.map((loan, index) => (
              <tr key={index} className="loan-row">
                <td>${loan.amount}</td>
                <td>{moment(loan.appliedDate).format('MMM Do YY')}</td>
                <td>{loan.purpose || 'N/A'}</td>
                <td>{loan.tenure || 'N/A'}</td> 
                <td>{loan.status || 'N/A'}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompleteLoan;
