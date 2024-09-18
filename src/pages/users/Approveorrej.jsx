import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/Approveorrej.css';

const Approveorrej = () => {
  const [loanRequests, setLoanRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loanStatus, setLoanStatus] = useState('pending');

  useEffect(() => {
    const fetchLoanRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/admin/loans?loanstatus=${loanStatus}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          },
        });
        const loans = response.data.loans;
        setLoanRequests(Array.isArray(loans) ? loans : []);
        setLoading(false);
      } catch (error) {
        setError('Failed to load loan requests');
        setLoading(false);
      }
    };

    fetchLoanRequests();
  }, [loanStatus]);

  const handleOpenModal = (id) => {
    setSelectedLoanId(id);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedLoanId) return;
    try {
      setLoading(true);
      await axios.get(`http://localhost:3000/api/admin/loans/approve/${selectedLoanId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
      });
      setSuccess('Loan approved successfully');
      setLoanRequests(loanRequests.filter((loan) => loan._id !== selectedLoanId));
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      setError('Failed to approve the loan');
      setLoading(false);
    }
  };
  console.log(localStorage.getItem('token'))

  const handleReject = async (_id) => {
    try {
      setLoading(true);
      await axios.get(`http://localhost:3000/api/admin/loans/reject/${_id}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),

        },
      });
      setSuccess('Loan rejected successfully');
      // console.log( localStorage.getItem('token'))
      setLoanRequests(loanRequests.filter((loan) => loan.id !== id));
      setLoading(false);
    } catch (error) {
      setError('Failed to reject the loan');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="container-fluid mt-5">
      {/* Loan Status Dropdown */}
      <div className="loan-status-dropdown">
        <label htmlFor="loanStatus" className="form-label">Filter by Loan Status:</label>
        <select
          id="loanStatus"
          className="form-select"
          value={loanStatus}
          onChange={(e) => setLoanStatus(e.target.value)}
        >
          <option value="pending">Pending Loans</option>
          <option value="approved">Approved Loans</option>
          <option value="rejected">Rejected Loans</option>
          <option value="completed">Completed Loans</option>
        </select>
      </div>

      {loading ? (
        <p>Loading loan requests...</p>
      ) : (
        loanRequests.length === 0 ? <p>No loan requests available</p> : (
          <div className="table-container">
            <table className="table-aprv table-bordered ">
              <thead className="thead-dark ">
                <tr>
                  <th>Amount</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Tenure</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanRequests.map((loan, index) => (
                  <tr key={index}>
                    <td>{loan.amount}</td>
                    <td>{loan.purpose}</td>
                    <td>{loan.status}</td>
                    <td>{loan.tenure}</td>
                    <td>
                      {loan.status === 'pending' && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleOpenModal(loan._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleReject(loan._id)}
                            disabled={loading}
                          >
                            {loading ? 'Rejecting...' : 'Reject'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Modal for approval confirmation */}
      {showModal && (
        <div className="modall">
          <div className="modalcontent">
            <h2>Are you sure you want to approve the loan?</h2>
            <button onClick={handleApprove} className="con-button" disabled={loading}>
              {loading ? 'Approving...' : 'Yes'}
            </button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approveorrej;
