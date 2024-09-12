import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './Components/Loginsinup/Loginsignup/Login';
import Signup from './Components/Loginsinup/Loginsignup/Signup';
import Dashboard from './Components/Dashboard/Dashboard';
import UserList from './pages/users/Userlist';
import Loanapplic from './pages/users/loanaplicatin/Loanapplic'
import Header from './Components/Dashboard/Header';
import Sidebar from './Components/Dashboard/Sidebar';
import Adduser from './pages/users/Adduser';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  const Layout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

    return (
      <>
        {!isAuthPage ? (
          <div className="grid-container">
            <>
              <Header OpenSidebar={OpenSidebar} handleLogout={handleLogout} />
              <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
              <Routes>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/userlist" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
                <Route path="/adduser" element={<ProtectedRoute><Adduser /></ProtectedRoute>} />
                <Route path="/loanapplic" element={<ProtectedRoute><Loanapplic /></ProtectedRoute>} />
              </Routes>
            </>
          </div>
        ) :
          <div>
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>

        }

      </>
    );
  };

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
