import React from "react";
import { Button, Table } from "react-bootstrap";
import '../newpages/emi.css'

const LoanDetails = () => {
  return (
    <div className="container-emi mt-5">
      <div className="loan-emi">
        <h4 className="loan-title">Loan Details</h4>
        
      </div>

      <div className="d-flex justify-content-between loan-summary">
        <div className="loan-info">
          <p><strong>Loan Amount :</strong> ₹11,000</p>
          <p><strong>interest :</strong> 0%</p>
          <p className="text-danger"><strong>interest amount :</strong> ₹550</p>
          <p className="text-danger"><strong>interest paid :</strong> 5</p>
        </div>
      

        <div className="card p-3 loan-card">
          <p><strong>Status :</strong> <span className="text-success">Pending</span></p>
          <p><strong>applied date :</strong> date</p>
          <p><strong>tenture :</strong> 6</p>
          <p><strong>Loan Purpose :</strong> Business Loan</p>
          <p><strong>tenure progress :</strong> 0/0</p>
          <p><strong>outstanding :</strong> ₹10,000</p>
        </div>
      </div>
      <div className="emibutn">
          <button className="btn btn-primary m-0">pay</button>
        </div>
     
    </div>
  );
};

export default LoanDetails;
