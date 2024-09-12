import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';

const Dashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
 

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
     <>
       <Home />
     </>
  );
};

export default Dashboard;
