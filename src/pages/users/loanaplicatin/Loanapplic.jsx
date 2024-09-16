import React, { useState } from 'react';
import './apl.css';
import axios from 'axios';

const Loanapplic = () => {
  const [userdetil, setuserdetail] = useState({
    amount: "",
    tenure: "",
    requestedRepaymentPeriod: "",
    documents: null,
   purpose: ""

  })

  const [error, seterror] = useState({});

  const handleChange = (e) => {
    const { name, value,type,files } = e.target;
    if (type === "file") {
      setuserdetail((prevDetails) => ({
        ...prevDetails,
        documents: files[0]
      }));
    } else {
      setuserdetail((prevDetails) => ({
        ...prevDetails,
        [name]: value
      }));
    }

    const error = validateField(name, value);
    seterror((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "amount":
        const amount = Number(value);
        if (!value) {
          error = "Please enter the desired loan amount";
        }
        break;
      case "Account_Number":
        if (!value) {
          error = "Account Number is required.";
        } else if (value.length < 12) {
          error = "Account Number must be at least 12 characters long.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;
    for (const key of Object.keys(userdetil)) {
      const error = validateField(key, userdetil[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    seterror(newErrors);

    if (!isValid) {
      console.log("Please fill the form correctly.");
      return;
    }
    const formData = new FormData();
    formData.append('amount', userdetil.amount);
    formData.append('tenure', userdetil.tenure);
    formData.append('requestedRepaymentPeriod', userdetil.requestedRepaymentPeriod);
    formData.append('purpose', userdetil.purpose);
    formData.append('documents', userdetil.documents);
  
    try {
      const response = await axios.post('http://localhost:3000/api/loans', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': localStorage.getItem('token')
        }
      });
      console.log("submitted Application", response.data);
    } catch (error) {
      console.error("Error adding user:", error.response ? error.response.data : error.message);
      seterror({ api: "An error occurred while adding the user. Please try again." });
    }
  };

  return (
    <>
      <main className='main-container'>
        <div className='main-title'>
          <h3>Loan Application Form</h3>
        </div>
        <div className="form-container">
          <div className="form-wrapper">
            <form className="loan-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="inline-fields">
                  <label>Desired Loan Amount $ <span className="required">*</span></label>
                  <label>Max amount you can apply: $500,000</label>
                  <input type="text" name="amount" className="ifield small-input" placeholder='Enter Loan Amount'
                    value={userdetil.amount} onChange={handleChange}
                  />
                  {error.amount && <span className="error-message">{error.amount}</span>}
                  <br />


                  <label htmlFor='tenure'>Select Tenure:</label>
                  <select id='tenure' name='tenure' value={userdetil.tenure} onChange={handleChange} className='ifield'
                  >
                    <option value=''>--Select Tenure--</option>
                    <option value='3'>3 months</option>
                    <option value='6'>6 months</option>
                    <option value='12'>12 months</option>
                  </select>
                  <label htmlFor='requestedRepaymentPeriod'>Payment Period:</label>
                  <select id='requestedRepaymentPeriod' name='requestedRepaymentPeriod' value={userdetil.requestedRepaymentPeriod} onChange={handleChange} className='ifield'
                  >
                    <option value=''>--Select Payment Period--</option>
                    <option value='6'>6 months</option>
                    <option value='8'>8 months</option>
                    <option value='10'>10 months</option>
                  </select>
                </div>
              </div>

              <div className='loan-purpose'>
                <h6 style={{ color: 'black' }}>Loan will be used for</h6>
                <div className="radio-options">
                  <input type="radio" id="business" name="purpose" value="Business Launching"
                    onChange={handleChange}
                  />
                  <label htmlFor="business">Business Launching</label>

                  <input type="radio" id="home" name="purpose"
                    value="Home Improvement"
                    onChange={handleChange}
                  />
                  <label htmlFor="home">Home Improvement</label>

                  <input type="radio" id="education" name="purpose" value="Education"
                    onChange={handleChange}
                  />
                  <label htmlFor="education">Education</label>

                  <input type="radio" id="investment" name="purpose"
                    value="Investment"
                    onChange={handleChange}
                  />
                  <label htmlFor="investment">Investment</label>
                </div>
              </div>
              <div className="form-section">
                <label>Upload Document:</label>
                <input type="file" name="documents" className="ifield" />
              </div>

              <button type="submit" className="loanaplbutton">Submit Application</button>

            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default Loanapplic;
