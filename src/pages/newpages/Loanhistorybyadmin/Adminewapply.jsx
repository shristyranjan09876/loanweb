import React, { useEffect, useState } from 'react';
import '../../newpages/CompleteLoan.css'
import axios from 'axios';
import moment from 'moment';

const Newapply = () => {
  const [loanStatus] = useState('pending'); 
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
        setError('Failed to load loan deatils');
        setLoading(false); 
      }
    };

    fetchLoanHistory();
  }, [loanStatus]);

  return (
    <div className="loan-container">
      <h2 className="loan-title">New Loan Applications</h2>
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
          {loanRequests.map((application, index) => (
            <tr key={index} className={application.status === 'Pending' ? 'pending' : 'approved'}>
              <td>${application.amount}</td>
              {/* <td>{application.appliedDate}</td> */}
              <td>{moment(application.appliedDate).format('MMM Do YY')}</td>
              <td>{application.purpose}</td>
              <td>{application.tenure}</td>
              <td>{application.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Newapply;
