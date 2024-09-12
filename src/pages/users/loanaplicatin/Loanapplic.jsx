import React from 'react';
import './apl.css'

const Loanapplic = () => {
  return (
    <>
      <main className='main-container'>
        <div className='main-title'>
          <h3>Loan Application Form</h3>
        </div>
        <div className="form-container">
          <div className="form-wrapper">
            <form className="loan-form">
              <div className="form-section">
              <div className="inline-fields">
                  <label>Desired Loan Amount $ <span className="required">*</span> </label>
                  <input type="text" name="loanAmount" className="ifield small-input" placeholder='Enter Loan Amount' />

                  <label>Annual Income $</label>
                  <input type="text" name="annualIncome" className="ifield small-input" placeholder='Enter Annual Income' />
                </div>
              </div>

              <div className='loan-purpose'>
                <h4>Loan will be used for</h4>
                <div className="radio-options">
                  <input type="radio" id="business" name="loanPurpose" value="Business Launching" />
                  <label htmlFor="business">Business Launching</label>

                  <input type="radio" id="home" name="loanPurpose" value="Home Improvement" />
                  <label htmlFor="home">Home Improvement</label>

                  <input type="radio" id="education" name="loanPurpose" value="Education" />
                  <label htmlFor="education">Education</label>

                  <input type="radio" id="investment" name="loanPurpose" value="Investment" />
                  <label htmlFor="investment">Investment</label>
                </div>
              </div>

              <div className="form-section">
                <h3>Contact Information</h3>
                <div>
                  <label>Date Of Birth: <span className="required">*</span></label>
                  <input type="date" name="dateOfBirth" className="ifield" />
                </div>

                <div className="form-section">
                  <div>
                    <label>Marital Status: <span className="required">*</span></label>
                    <select name="maritalStatus" className="ifield">
                      <option value="">Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                    </select>
                  </div>
                  <div>
                    <label>How long have you lived at your current address? <span className="required">*</span></label>
                    <input type="text" name="addressDuration" className="ifield" placeholder="Enter duration in years" />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Employment Information</h4>
                  <div>
                    <label>Department: <span className="required">*</span></label>
                    <select name="department" className="ifield">
                      <option value="">Select Department</option>
                      <option value="HR">HR</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div>
                    <label>Position: <span className="required">*</span></label>
                    <select name="position" className="ifield">
                      <option value="">Select Position</option>
                      <option value="Manager">Manager</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                    </select>
                  </div>
                  <div>
                    <label>Salary: <span className="required">*</span></label>
                    <input type="text" name="salary" className="ifield" placeholder='Enter Salary' />
                  </div>
                  <div>
                    <label>Join Date: <span className="required">*</span></label>
                    <input type="date" name="joinDate" className="ifield" />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Bank Reference</h4>
                  <div>
                    <label>Bank Name:</label>
                    <input type="text" name="bankName" className="ifield" placeholder="Enter Bank Name" />
                  </div>
                  <div>
                    <label>Account Number:</label>
                    <input type="text" name="accountNumber" className="ifield" placeholder="Enter Account Number" />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Contact Information</h4>
                  <div>
                    <label>Name: <span className="required">*</span></label>
                    <input type="text" name="contactName" className="ifield" placeholder='Enter Your Name' />
                  </div>
                  <div>
                    <label>Email: <span className="required">*</span></label>
                    <input type="email" name="email" className="ifield" placeholder='Enter Your Email' />
                  </div>
                  <div>
                    <label>Phone: <span className="required">*</span></label>
                    <input type="tel" name="phone" className="ifield" placeholder='Enter Your Phone Number' />
                  </div>
                </div>

                <div className="form-section">
                  <h4>Login Information</h4>
                  <div>
                    <label>Password: <span className="required">*</span></label>
                    <input type="password" name="password" className="ifield" placeholder='Enter Password' />
                  </div>
                </div>

                <div className="form-section">
                  <label>Upload Document: <span className="required">*</span></label>
                  <input type="file" name="document" className="ifield" />
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
