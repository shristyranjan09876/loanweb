import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Loginsinup/Loginsignup/Login';
import Signup from './Components/Loginsinup/Loginsignup/Signup';
import Dashboard from './Components/Dashboard/Dashboard';
import UserList from './pages/users/Userlist';
import Loanapplic from './pages/users/loanaplicatin/Loanapplic';
import Header from './Components/Dashboard/Header';
import Sidebar from './Components/Dashboard/Sidebar';
import Adduser from './pages/users/Adduser';
import './App.css';
// import NotFound from './404page';
import Forgetps from './Components/Loginsinup/Loginsignup/Forgetps';
import Edituser from './pages/users/Edituser';
import Otp from './Components/Loginsinup/Loginsignup/Otp';
import Newps from './Components/Loginsinup/Loginsignup/Newps';
import CompleteLoan from './pages/newpages/Completeloan';
import Newapply from './pages/newpages/Newapply';
import Pendingloan from './pages/newpages/Pendingloan';
import ProfilePage from './pages/users/ProfilePage';
import EditProfilePage from './pages/users/Editprofile';
import Approveorrej from './pages/users/Approveorrej';
import Admincmpltloan from './pages/newpages/Loanhistorybyadmin/admincmpltloan';
import Adminpendingloan from './pages/newpages/Loanhistorybyadmin/Adminpendingloan';
import Adminewapply from './pages/newpages/Loanhistorybyadmin/Adminewapply';
import Emi from './pages/newpages/Emi'
import PayEMI from './pages/newpages/Payemi';

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

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="grid-containermain">
          <BrowserRouter>
            <Header OpenSidebar={OpenSidebar} setIsAuthenticated={setIsAuthenticated} />
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/userlist" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
              <Route path="/adduser" element={<ProtectedRoute><Adduser /></ProtectedRoute>} />
              <Route path="/loanapplic" element={<ProtectedRoute><Loanapplic /></ProtectedRoute>} />
              <Route path="/edituser/:id" element={<ProtectedRoute><Edituser /></ProtectedRoute>} />
               {/* loan history by employee */}
              <Route path="/newapply" element={<ProtectedRoute><Newapply /></ProtectedRoute>} />
              <Route path="/pendingloan" element={<ProtectedRoute><Pendingloan /></ProtectedRoute>} />
              <Route path="/completeLoan" element={<ProtectedRoute><CompleteLoan /></ProtectedRoute>} />
              {/* *****end***** */}
              <Route  path="/profilePage"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> {/* Fixed path */}
              <Route  path="/editProfilePage"  element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} /> 
              <Route  path="/approveorrej"  element={<ProtectedRoute><Approveorrej/></ProtectedRoute>} />
              {/* loan history by admin */}
              <Route path="/admincmpltloan" element={<ProtectedRoute><Admincmpltloan /></ProtectedRoute>} />
              <Route path="/adminewapply" element={<ProtectedRoute><Adminewapply /></ProtectedRoute>}/>
              <Route path="/adminpendingloan" element={<ProtectedRoute><Adminpendingloan /></ProtectedRoute>}/>
                {/* *****end***** */}
                <Route path="/emi" element={<ProtectedRoute><Emi /></ProtectedRoute>}/>
                <Route path="/payEMI" element={<ProtectedRoute><PayEMI /></ProtectedRoute>}/>
            </Routes>
          </BrowserRouter>
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgetps" element={<Forgetps />} />
            <Route path="/otp" element={<Otp />} />
            <Route path="/newps" element={<Newps />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
