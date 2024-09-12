import React, { useState } from 'react';
import Header from '../../../Components/Dashboard/Header';
import Sidebar from '../../../Components/Dashboard/Sidebar';
import Loanapplic from './Loanapplic';

const Loanapdash = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <Loanapplic />
        
    </div>
  );
};

export default Loanapdash;
