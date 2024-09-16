import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './style/ProfilePage.css'
import moment from 'moment';

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
    <div className="profile-page">
    <div className="profile-card">
      <h2 style={{textAlign:"center"}}>User Profile</h2>
      <div className="profile-info">
        <label>Name:</label>
        <p>{userProfile.firstName} {userProfile.lastName}</p>
      </div>
      <div className="profile-info">
        <label>Date of Birth:</label>
        <p>{moment(userProfile.dateOfBirth).format('MMM Do YY')}</p>
        {/* <p>{userProfile.dateOfBirth}</p> */}
      </div>
      <div className="profile-info">
        <label>Department:</label>
        <p>{userProfile.department}</p>
      </div>
      <div className="profile-info">
        <label>Position:</label>
        <p>{userProfile.position}</p>
      </div>
      <div className="profile-info">
        <label>Salary:</label>
        <p>{userProfile.salary}</p>
      </div>
      <div className="profile-info">
        <label>Join Date:</label>
        <p>{moment(userProfile.joinDate).format('MMM Do YY')}</p>
        {/* <p>{userProfile.joinDate}</p> */}
      </div>
      <div className="button-container">
        <Link to="/editProfilePage" className="edit-button">Edit Profile</Link>
      </div>
    </div>
  </div>
  );
};

export default ProfilePage;
