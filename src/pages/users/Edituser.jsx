import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/edituser.css'

const Edituser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    department: "",
    position: "",
    salary: "",
    joinDate: "",
  });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/employee/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token'),
          },
        });
        console.log("response edit ++", response)
        setEdit(response.data);
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEdit((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/admin/employees/${id}`, edit, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token'),
        },
      });
      navigate('/userlist');
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="add-store-container">
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={edit.firstName}
          onChange={handleInputChange}
        />
        <br />
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={edit.lastName}
          onChange={handleInputChange}
        />
        <br />
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={edit.dateOfBirth}
          onChange={handleInputChange}
        />
        <br />
        <label>Department:</label>
        <input
          type="text"
          name="department"
          value={edit.department}
          onChange={handleInputChange}
        />
        <br />
        <label>Position:</label>
        <input
          type="text"
          name="position"
          value={edit.position}
          onChange={handleInputChange}
        />
        <br />
        <label>Salary:</label>
        <input
          type="number"
          name="salary"
          value={edit.salary}
          onChange={handleInputChange}
        />
        <br />
        <label>Join Date:</label>
        <input
          type="date"
          name="joinDate"
          value={edit.joinDate}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default Edituser;
