import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './style/ProfilePage.css'

const ProfilePage = () => {
  const { id } = useParams(); 
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
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5 profile-page">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="profile-card p-4 rounded shadow-sm">
            <h2 className="text-center mb-4">User Profile</h2>
            <div className="form-group mb-3">
              <label className="font-weight-bold"> Name:</label>
              <p>{userProfile.firstName} {userProfile.lastName}</p>
            </div>
            {/* <div className="form-group mb-3">
              <label className="font-weight-bold">Last Name:</label>
              <p>{userProfile.lastName}</p>
            </div> */}
            <div className="form-group mb-3">
              <label className="font-weight-bold">Date of Birth:</label>
              <p>{userProfile.dateOfBirth}</p>
            </div>
            <div className="form-group mb-3">
              <label className="font-weight-bold">Department:</label>
              <p>{userProfile.department}</p>
            </div>
            <div className="form-group mb-3">
              <label className="font-weight-bold">Position:</label>
              <p>{userProfile.position}</p>
            </div>
            <div className="form-group mb-3">
              <label className="font-weight-bold">Salary:</label>
              <p>{userProfile.salary}</p>
            </div>
            <div className="form-group mb-4">
              <label className="font-weight-bold">Join Date:</label>
              <p>{userProfile.joinDate}</p>
            </div>
            <div className="text-center">
              <Link to="/editProfilePage" className="btn btn-primary btn-lg">Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
