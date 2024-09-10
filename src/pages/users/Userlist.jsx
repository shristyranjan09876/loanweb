import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './style/adduser.css';


const UserList = () => {
  const [userlist, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); 
  const navigate = useNavigate();



  const handleEdit = (userId) => {
    navigate(`/edituser/${userId}`);
  };

  const confirmDelete = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  return (
    <>
      <div className="bookcontainer">
        <h1>User List</h1>
        <div>
          {userlist.length > 0 ? (
            userlist.map((user, index) => (
              <div key={index} className="useritem">
                <div>
                  <h2>{user.firstName}</h2>
                  <p>{user.lastName}</p>
                  <p>{user.dateOfBirth}</p>
                  <p>{user.department}</p>
                  <p>{user.position}</p>
                  <p>{user.salary}</p>
                  <p>{user.joinDate}</p>
                  <p>{user.email}</p>
                  {user.document && (
                    <img
                      src={""}
                      alt={user.document}
                      style={{ width: '150px', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="bookaction">
                  <button onClick={() => handleEdit(user._id)} className="edit-button">Edit</button>
                  <button onClick={() => confirmDelete(user._id)} className="delete-button">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', fontSize: "20px" }}>Loading....</p>
          )}
        </div>

        {showModal && (
          <div className="modall">
            <div className="modalcontent">
              <h2>Are you sure you want to delete this user?</h2>
              <button onClick={handleDelete} className="confirm-button">Delete</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;
