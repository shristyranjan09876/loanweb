import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './style/adduser.css';
//import axios from 'axios';

const Adduser = () => {
  const [username, setUsername] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    department: "",
    position: "",
    salary:"",
    joinDate:"",
    document: null,  // For file uploads
    email:"",
    password:""
  });
  const [errors, setErrors] = useState({});  // State to store validation errors
  const navigate = useNavigate(); 
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const validateForm = () => {
    let formErrors = {};

    // First Name validation
    if (!username.firstName.trim()) {
      formErrors.firstName = "First Name is required.";
    }


    // Date of Birth validation
    if (!username.dateOfBirth) {
      formErrors.dateOfBirth = "Date of Birth is required.";
    }

    // Department validation
    if (!username.department.trim()) {
      formErrors.department = "Department is required.";
    }

    // Position validation
    if (!username.position.trim()) {
      formErrors.position = "Position is required.";
    }

    // Salary validation
    if (!username.salary.trim()) {
      formErrors.salary = "Salary is required.";
    }

    // Email validation
    if (!username.email.trim()) {
      formErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(username.email)) {
      formErrors.email = "Email is invalid.";
    }

    // Password validation
    if (!username.password.trim()) {
      formErrors.password = "Password is required.";
    }

    // Join Date validation
    if (!username.joinDate) {
      formErrors.joinDate = "Join Date is required.";
    }

    // Document validation
    if (!username.document) {
      formErrors.document = "Document is required.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  const handleSub = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      console.log('user added sucessfully' ,username);
    }
  
    
    const formData = new FormData();
    formData.append('firstName', username.firstName);
    formData.append('lastName', username.lastName);
    formData.append('dateOfBirth', username.dateOfBirth);
    formData.append('department', username.department);
    formData.append('position', username.position);
    formData.append('salary', username.salary);
    formData.append('joinDate', username.joinDate);
    formData.append('document', username.document);
    formData.append('email', username.email);
    formData.append('password', username.password);

    // Uncomment this when you are ready to send the form data
    /*
    try {
      const response = await axios.post("http://localhost:8082/users/add_user", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-access-token': localStorage.getItem('token') // Include token in the request headers
        }
      });
      console.log(response.data);
      navigate('/userlist'); 
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
    */
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUsername((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // File input handler
  const handleFileInput = (e) => {
    setUsername((prevDetails) => ({
      ...prevDetails,
      document: e.target.files[0],
    }));
  };

  return (
    <>
    <main className='main-container'>
    <div className='main-title'>
            <h3>ADD USER</h3>
        </div>
    <div className="a">
      <div className="b">
        {/* <h1>Add Users</h1> */}
        {/* <p>Fill out the form below to add a new user.</p> */}
        <form onSubmit={handleSub} className="c">
        <div className="name-fields">
            <div>
              <label>First Name: <span style={{color:'red'}}>*</span> </label>
              <input type="text" name="firstName" className="ifield" placeholder='Enter First Name' value={username.firstName} onChange={handleInput} />
              {errors.firstName && <p className="errortext">{errors.firstName}</p>}
            </div>
            <div>
              <label>Last Name:</label>
              <input type="text" name="lastName" className="ifield"  placeholder='Last First Name' value={username.lastName} onChange={handleInput} />
              
            </div>
          </div>
          
          <label>Date Of Birth:<span style={{color:'red'}}>*</span></label>
          <input type="date" name="dateOfBirth" className="tfield" value={username.dateOfBirth} onChange={handleInput} />
          {errors.dateOfBirth && <p className="errortext">{errors.dateOfBirth}</p>}
          
          <label>Department:<span style={{color:'red'}}>*</span></label>
          <select name="department" className="ifield" value={username.department} onChange={handleInput}>
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          {errors.department && <p className="errortext">{errors.department}</p>}
          
          <label>Position:<span style={{color:'red'}}>*</span></label>
          <select name="position" className="ifield" value={username.position} onChange={handleInput}>
            <option value="">Select Position</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
          </select>
          {errors.position && <p className="errortext">{errors.position}</p>}
          
          <label>Salary:<span style={{color:'red'}}>*</span></label>
          <input type="text" name="salary" className="ifield"  placeholder='Enter Salary ' value={username.salary} onChange={handleInput} />
          {errors.salary && <p className="errortext">{errors.salary}</p>}
          
          <label>Join Date:<span style={{color:'red'}}>*</span></label>
          <input type="date" name="joinDate" className="ifield" value={username.joinDate} onChange={handleInput} />
          {errors.joinDate && <p className="errortext">{errors.joinDate}</p>}
          
          <label>Document:<span style={{color:'red'}}>*</span></label>
          <input type="file" name="document" className="ifield" onChange={handleFileInput} />
          {errors.document && <p className="errortext">{errors.document}</p>}
          
          <label>Email:<span style={{color:'red'}}>*</span></label>
          <input type="email" name="email" className="ifield"  placeholder='Enter Your email' value={username.email} onChange={handleInput} />
          {errors.email && <p className="errortext">{errors.email}</p>}
          
          <label>Password:<span style={{color:'red'}}>*</span></label>
          <input type="password" name="password" className="ifield"  placeholder='Enter Password ' value={username.password} onChange={handleInput} />
          {errors.password && <p className="errortext">{errors.password}</p>}
          
          <button type="submit" className="submit-button">Add User</button>
        </form>
      </div>
    </div>
</main>
    </>
  );
};

export default Adduser;
