import React, { useState } from 'react';
import '../newpages/emi.css'

const PayEMI = () => {
  // State to manage form fields
  const [emiAmount, setEmiAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the payment logic (API calls)
    setConfirmation('Payment Successful!');
  };

  return (
    <div className="pay-emi-container">
      <h2>Pay EMI</h2>
      <div className="emi-details">
        <p><strong>Loan Balance:</strong> ₹5,00,000</p>
        <p><strong>Next Due Date:</strong> 30th September 2024</p>
        <p><strong>EMI Amount:</strong> ₹10,000</p>
      </div>
      <form onSubmit={handleSubmit} className="emi-form">
        <div className="form-group">
          <label>EMI Amount</label>
          <input
            type="number"
            value={emiAmount}
            onChange={(e) => setEmiAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Bank Name</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="" disabled>Select Method</option>
            <option value="netbanking">Net Banking</option>
            <option value="creditcard">Credit Card</option>
            <option value="debitcard">Debit Card</option>
            <option value="upi">UPI</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Pay Now</button>
      </form>
      {confirmation && <p className="confirmation">{confirmation}</p>}
    </div>
  );
};

export default PayEMI;
