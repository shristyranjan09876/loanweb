import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Otp = () => {
    const [userDetails, setUserDetails] = useState({
        Otp: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    // Handle OTP form submission
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            let email = localStorage.getItem('fEmail');

            if (!email) {
                toast.error("Email not found. Please try again.");
                return;
            }

            // Make the API request for OTP verification
            const response = await axios.post('http://localhost:3000/api/auth/verifyOTP', {
                otp: userDetails.Otp, 
                email: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response && response.data) {
                if (response.status === 200) {
                    toast.success("OTP successfully verified.");
                    localStorage.setItem('nOtp', userDetails.Otp);
                    console.log(response.data);
                    navigate('/Newps'); 
                } else {
                    toast.error(response.data.message || "Verification failed.");
                }
            } else {
                toast.error("Unexpected response format from the server.");
            }
        } catch (error) {
            console.error('Error during OTP verification:', error.response ? error.response.data : error.message);
            toast.error("OTP verification failed. Please try again.");
        }
    };

    return (
        <div className="signup">
            <div className="background-image">
                <div className="overlay-content">
                    <div className="text-section">
                        <h1>Your Trusted Loan Partner</h1>
                        <p>Get the Loan You Need, When You Need It</p>
                    </div>
                    <div className="signup-form">
                        <form onSubmit={handleOtpSubmit} noValidate>
                            <h2 style={{ textAlign: 'center' }}>OTP Verification</h2>
                            {loginError && <p className="error-message">{loginError}</p>}
                            <div className='formsec'>
                                <label htmlFor='Otp'>OTP:</label>
                                <input
                                    type='text'
                                    id='Otp'
                                    name='Otp'
                                    placeholder='Enter your OTP'
                                    value={userDetails.Otp}
                                    onChange={handleChange}
                                />
                                {errors.Otp && <span className="error-message">{errors.Otp}</span>}
                                <button type='submit'>Verify OTP</button>
                            </div>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Otp;
