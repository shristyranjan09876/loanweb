import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Loginsinup/Loginsignup/Login'
import Signup from './Components/Loginsinup/Loginsignup/Signup'
import Dashboard from './Components/Dashboard/Dashboard'
import './App.css'
//import Adduser from './pages/users/Adduser';
import UserList from './pages/users/Userlist';
import Userdashb from './pages/users/Userdashb';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/userdashb" element={<Userdashb/>} />
        <Route path="/userlist" element={<UserList />} />
        {/* <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
        <Route path="/adduser" element={<ProtectedRoute> <Adduser /> </ProtectedRoute>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
