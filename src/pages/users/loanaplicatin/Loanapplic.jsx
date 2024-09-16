import React, { useState } from 'react';
import './apl.css';

const Loanapplic = () => {
  const [userdetil, setuserdetail] = useState({
    Desired_Loan_Amount: "",
    Annual_Income: "",
    Date_Of_Birth: "",
    Bank_Name: "",
    Account_Number: "",
    Upload_Document: "",
    tenure: "",
    Loan_used_for: {
      Business_Launching: "",
      Home_Improvement: "",
      Education: "",
      Investment: "",
    },
    Marital_Status: {
      Married: "",
      Single: "",
      Divorced: "",
    }
  })

  const [error, seterror] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setuserdetail((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));

    const error = validateField(name, value);
    seterror((prevErrors) => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "Desired_Loan_Amount":
        const amount = Number(value);
        if (!value) {
          error = "Please enter the desired loan amount";
        } else if (amount < 200000) {
          error = "Desired loan amount should be at least 200,000.";
        } else if (amount > 500000) {
          error = "Desired loan amount should be 500,000 or less.";
        }
        break;
      case "Annual_Income":
        if (!value) {
          error = "Please enter the Annual Income";
        } else if (Number(value) > 5000000) {
          error = "Annual Income should be 5,000,000 or less.";
        }
        break;
      case "Bank_Name":
        if (!value) {
          error = "Bank Name is required.";
        } else if (value.length < 6) {
          error = "Bank Name must be at least 6 characters long.";
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

  const handleSubmit = (e) => {
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

    console.log("Form submitted successfully", userdetil);
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
                  <input type="text" name="Desired_Loan_Amount" className="ifield small-input" placeholder='Enter Loan Amount'
                    value={userdetil.Desired_Loan_Amount} onChange={handleChange}
                  />
                  {error.Desired_Loan_Amount && <span className="error-message">{error.Desired_Loan_Amount}</span>}
                  <br />
                  <label>Annual Income $ <span className="required">*</span></label>
                  <input type="text" name="Annual_Income" className="ifield small-input" value={userdetil.Annual_Income}
                    onChange={handleChange} placeholder='Enter Annual Income'
                  />
                  {error.Annual_Income && <span className="error-message">{error.Annual_Income}</span>}

                  <label htmlFor='tenure'>Select Tenure:</label>
                  <select id='tenure' name='tenure' value={userdetil.tenure} onChange={handleChange} className='ifield'
                  >
                    <option value=''>--Select Tenure--</option>
                    <option value='3'>3 months</option>
                    <option value='6'>6 months</option>
                    <option value='12'>12 months</option>
                  </select>
                </div>
              </div>

              <div className='loan-purpose'>
                <h4>Loan will be used for</h4>
                <div className="radio-options">
                  <input type="radio" id="business" name="Loan_used_for" value="Business Launching"
                    onChange={handleChange}
                  />
                  <label htmlFor="business">Business Launching</label>

                  <input type="radio" id="home" name="Loan_used_for"
                    value="Home Improvement"
                    onChange={handleChange}
                  />
                  <label htmlFor="home">Home Improvement</label>

                  <input type="radio" id="education" name="Loan_used_for" value="Education"
                    onChange={handleChange}
                  />
                  <label htmlFor="education">Education</label>

                  <input type="radio" id="investment" name="Loan_used_for"
                    value="Investment"
                    onChange={handleChange}
                  />
                  <label htmlFor="investment">Investment</label>
                </div>
              </div>

              <div className="form-section">
                <h3>Personal Information</h3>
                <div>
                  <label>Date Of Birth:</label>
                  <input type="date" name="Date_Of_Birth" className="ifield"
                    value={userdetil.Date_Of_Birth}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-section">
                  <div>
                    <label>Marital Status:</label>
                    <select name="Marital_Status" className="ifield"
                      value={userdetil.Marital_Status}
                      onChange={handleChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>

                  <div>
                    <label>How long have you lived at your current address?</label>
                    <input type="text" name="addressDuration" className="ifield"
                      placeholder="Enter duration in years"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Bank Reference</h4>
                  <div>
                    <label>Bank Name:<span className="required">*</span></label>
                    <input
                      type="text" name="Bank_Name" className="ifield" placeholder="Enter Bank Name"
                      value={userdetil.Bank_Name}
                      onChange={handleChange}
                    />
                    {error.Bank_Name && <span className="error-message">{error.Bank_Name}</span>}
                  </div>

                  <div>
                    <label>Account Number:<span className="required">*</span></label>
                    <input type="text" name="Account_Number" className="ifield" placeholder="Enter Account Number"
                      value={userdetil.Account_Number}
                      onChange={handleChange}
                    />
                    {error.Account_Number && <span className="error-message">{error.Account_Number}</span>}
                  </div>
                </div>

                <div className="form-section">
                  <label>Upload Document:</label>
                  <input type="file" name="Upload_Document" className="ifield" />
                </div>

                <button type="submit" className="submit-button">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default Loanapplic;
