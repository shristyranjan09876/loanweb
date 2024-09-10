import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
//import axios from 'axios'

const Login = ({onLogin}) => {
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
            case "password":
                if (!value) {
                    error = "Password is required.";
                } else if (value.length < 6) {
                    error = "Password must be at least 6 characters long.";
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
        console.log("Form submitted successfully:", userDetails);
        // Navigate to another page if login is successful
        // navigate('/some-path');
        onLogin();
    navigate('/dashboard');
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
                        <form onSubmit={handleSubmit} noValidate>
                            <h2 style={{ textAlign: 'center' }}>Log-in</h2>
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

                                <label htmlFor='password'>Password:</label>
                                <input
                                    type='password'
                                    id='password'
                                    name='password'
                                    placeholder='Enter your Password'
                                    value={userDetails.password}
                                    onChange={handleChange}
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}

                                <button type='submit'>Log-in</button>
                                <p>Don't have an Account? <Link to='/signup'>Create Account</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
