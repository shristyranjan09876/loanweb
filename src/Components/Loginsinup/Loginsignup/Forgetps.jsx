import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Forgetps = () => {
    const [userDetails, setUserDetails] = useState({
        email: "",
      
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));

        const error = validateField(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error
        }));
    };

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "email":
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    error = "Email is required.";
                } else if (!emailPattern.test(value)) {
                    error = "Please enter a valid email address.";
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

        for (const key of Object.keys(userDetails)) {
            const error = validateField(key, userDetails[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);

        if (!isValid) {
            console.log("Please fill the form correctly:");
            return;
        }
        try {
            const response = await axios.post( 'http://localhost:3000/api/auth/forgotpassword', {
                    email: userDetails.email,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        
            console.log('API Response:', response.status); 
            if (response.status === 200) {
                toast.success("OTP has been sent to your email.");
                localStorage.setItem('fEmail', userDetails.email);
                console.log("Email sent:", response.data);
                navigate('/otp');
            } else {
                toast.error(response.data?.message || "Failed to send OTP.");
            }
        
        } catch (error) {
            console.error('Request error:', error.response?.data || error.message);
            toast.error("Failed to send OTP. Please try again.");
        }
    }        
    
   

    return (
        <div className="signup">
            <div className="background-image">
                <div className="overlay-content">
                    <div className="text-section">
                        <h1>Your Trusted Loan Partner</h1>
                        <p>Get the Loan You Need, When You Need It</p>
                    </div>
                    <div className="signup-form">
                        <form onSubmit={handleSubmit} noValidate>
                            <h2 style={{ textAlign: 'center' }}>Email Verification</h2>
                            {loginError && <p className="error-message">{loginError}</p>}
                            <div className='formsec'>
                                <label htmlFor='email'>Email:</label>
                                <input
                                    type='email'
                                    id='email'
                                    name='email'
                                    placeholder='Enter your Email'
                                    value={userDetails.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                                <button type='submit'>Verify Email</button>
                               </div>
                        </form>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forgetps;
