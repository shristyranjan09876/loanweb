import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style/ProfilePage.css'

const EditProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    department: "",
    position: "",
    salary: "",
    joinDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/employee/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        });

        if (response.status === 200) {
          setUserProfile(response.data);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (error) {
        setLoading(false);
        setError(error.response ? error.response.data : error.message);
      }
    };

    fetchUser();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('No token found. Please login.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/employee/employees`, userProfile, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        navigate('/profilePage');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5 edit-profile-page">
      <div className="row">
        <div className="col-md-12 ">
          <div className="edit-profile-card ">
            <h2 className="text-center mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label className="font-weight-bold">First Name:</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={userProfile.firstName}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="font-weight-bold">Last Name:</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={userProfile.lastName}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="font-weight-bold">Date of Birth:</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  value={userProfile.dateOfBirth}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="font-weight-bold">Department:</label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={userProfile.department}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="font-weight-bold">Position:</label>
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={userProfile.position}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <label className="font-weight-bold">Salary:</label>
                <input
                  type="text"
                  name="salary"
                  className="form-control"
                  value={userProfile.salary}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label className="font-weight-bold">Join Date:</label>
                <input
                  type="date"
                  name="joinDate"
                  className="form-control"
                  value={userProfile.joinDate}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
