import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SetNewPassword = () => {
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
        
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setPasswords((prevPasswords) => ({
            ...prevPasswords,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (passwords.password === "") {
            setError("Password is required.");
            toast.error("Password is required.");
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Passwords do not match.");
            toast.error("Passwords do not match.");
            return;
        }
        
        let otp = localStorage.getItem('nOtp');
    console.log('Retrieved OTP:', otp); 

    if (!otp) {
        setError("OTP is missing. Please try again.");
        toast.error("OTP is missing. Please try again.");
        return;
    }
    

        try {
            const email = localStorage.getItem('fEmail');
           
            const response = await axios.put('http://localhost:3000/api/auth/resetPassword', {
                newPassword: passwords.newPassword,
                email: email,
                otp: otp  
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('API Response:', response.data);
            if (response.data.code === 200) {
                toast.success("Password successfully updated.");
                console.log("Password successfully changed");
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setError(response.data.message || "Failed to update password. Please try again.");
                toast.error(response.data.message || "Failed to update password. Please try again.");
            }
        }catch (error) {
                console.error('Error during password update:', error.response ? error.response.data : error.message);
                const errorMessage = error.response?.data?.error || "Failed to update password. Please try again.";
                setError(errorMessage);
                toast.error(errorMessage);
            }   
        // } catch (error) {
        //     console.error('Error during password update:', error.response ? error.response.data : error.message);
        //     setError("Failed to update password. Please try again.");
        //     toast.error("Failed to update password. Please try again.");
        // }
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
                            <h2 style={{ textAlign: 'center' }}>New Password</h2>
                            <div className='formsec'>
                                <label htmlFor='password'>New Password:</label>
                                <input
                                    type='password'
                                    id='newPassword'
                                    name='newPassword'
                                    placeholder='Enter your new password'
                                    value={passwords.newPassword}
                                    onChange={handleInput}
                                />
                            </div>
                            <br />
                            <div className='formsec'>
                                <label htmlFor='confirmPassword'>Confirm Password:</label>
                                <input
                                    type='password'
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    placeholder='Confirm your password'
                                    value={passwords.confirmPassword}
                                    onChange={handleInput}
                                />
                            </div>
                            {error && <p className="error-message">{error}</p>}
                            <button type='submit'>Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SetNewPassword;
