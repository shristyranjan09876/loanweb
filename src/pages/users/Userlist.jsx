import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './style/userlist.css';
import moment from 'moment';

const UserList = () => {
  const [userlist, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/employees', {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
          }
        });
        setUserList(response.data);
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
      }
    };

    fetchUser();
  }, []);

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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/employees/${userToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
        }
      });
      setUserList(userlist.filter(user => user._id !== userToDelete));
      handleCancel();
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div className="listcontainer">
        {/* <h1>Employee List</h1> */}
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              {/* <th>Date of Birth</th> */}
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Join Date</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userlist.length > 0 ? (
              userlist.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  {/* <td>{user.dateOfBirth}</td> */}
                  <td>{user.department}</td>
                  <td>{user.position}</td>
                  <td>${user.salary}</td>
                  <td>{moment(user.joinDate).format('MMM Do YY')}</td>
                  <td>{user.userDetails.email}</td>
                 
                  <td className="modal-actions">
                    <button onClick={() => handleEdit(user._id)} className="edit-button">
                    <img src='src/assets/edit.png' height="20px" width="20px" />
                    </button>
                    <button onClick={() => confirmDelete(user._id)} className="delete-button">
                    <img src='src/assets/delete.png' height="20px" width="20px" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>Loading....</td>
              </tr>
            )}
          </tbody>
        </table>

        {showModal && (
          <div className="modall">
            <div className="modalcontent">
              <h2>Are you sure you want to delete this user?</h2>
              <button onClick={handleDelete} className="con-button">Delete</button>
              <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserList;
