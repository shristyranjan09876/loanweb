import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

const Signup = () => {
    const [userDetails, setUserDetails] = useState({
        name: "",
        lName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone" && !/^\d*$/.test(value)) return;

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
            case "name":
                if (!value) {
                    error = "Name is required.";
                } else if (value.length < 3) {
                    error = "Name must be at least 3 characters long.";
                }
                break;
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
            case "phone":
                const phonePattern = /^\d{10}$/;
                if (!value) {
                    error = "Phone number is required.";
                } else if (!phonePattern.test(value)) {
                    error = "Phone number must be exactly 10 digits.";
                }
                break;
            default:
                break;
        }

        return error;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields and set errors
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
            // for (const key in newErrors) {
            //     if (newErrors.hasOwnProperty(key)) {
            //         console.log(`Please fill the form correctly:`);
            //     }
            // }
            return;
        }

        console.log("Form submitted successfully:", userDetails);
        // Navigate to another page
        // navigate('/some-path'); // Replace '/some-path' with your target path
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
                            <h2 style={{ textAlign: 'center' }}>Sign-up</h2>
                            <div className='formsec'>
                                <label htmlFor='name'>Name:</label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    placeholder='Enter your name'
                                    value={userDetails.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                                
                                <label htmlFor='lname'>Last Name:</label>
                                <input
                                    type='text'
                                    id='lname'
                                    name='lName'
                                    placeholder='Enter your Last name'
                                    value={userDetails.lName}
                                    onChange={handleChange}
                                />

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
                                
                                <label htmlFor='phone'>Phone:</label>
                                <input
                                    type='tel'
                                    id='phone'
                                    name='phone'
                                    placeholder='Enter your Phone.no'
                                    value={userDetails.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                                
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
                                
                                <button type='submit'>Sign Up</button>
                                <p>Already have an Account <Link to='/'>Log-in</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
