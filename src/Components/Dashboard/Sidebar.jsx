import React from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, NavLink } from 'react-router-dom';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import './sidebar.css'

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {

  const adminLinks = [
    { to: "/dashboard", icon: <BsGrid1X2Fill />, label: "Home" },
    { to: "/active-loans", icon: <BsFillArchiveFill />, label: "Active Loans" },
    { to: "/payments-today", icon: <BsFillGrid3X3GapFill />, label: "Payments Today" },
    { to: "/approveorrej", icon: <BsPeopleFill />, label: "Loan Request" },
    { to: "/loan-types", icon: <BsMenuButtonWideFill />, label: "Loan Types" },
    { to: "/adduser", icon: <AccountCircleIcon />, label: "Add Employee" },
    { to: "/userlist", icon: <AccountCircleIcon />, label: "Employee List" },
    { to: "/settings", icon: <BsFillGearFill />, label: "Settings" },
  ];

  const employeeLinks = [
    { to: "/dashboard", icon: <BsGrid1X2Fill />, label: "Home" },
    { to: "/Loans History", icon: <BsFillArchiveFill />, label: "Active Loans" },
    { to: "/payments-today", icon: <BsFillGrid3X3GapFill />, label: "Payments Today" },
    { to: "/loanapplic", icon: <BsFillGrid3X3GapFill />, label: "Loan Application" },
    { to:  `/profilePage`, icon: <BsPeopleFill />, label: "My Profile" },
  ];

  const role = localStorage.getItem("role");
  const links = role === 'admin' ? adminLinks : employeeLinks;

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <AccountCircleIcon className='icon_header' /> {role === 'admin' ? 'Admin Panel' : 'Employee Panel'}
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        {links.map((link, index) => (
          <li key={index} className='sidebar-list-item'>
            <Link to={link.to}>
              {link.icon} {link.label}
            </Link>
          </li>
        ))}
        {role === 'employee' && (
          <li className='sidebar-list-drop'>
            <DropdownButton 
              id="dropdown-loan-history" 
              variant="light" 
              title={
                <>
                  <BsFillArchiveFill style={{ marginRight: '8px' }} /> 
                  Loan History
                </>
              }>
              <Dropdown.Item as={NavLink} to="/completeloan">Complete Loan</Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/pendingloan">Pending Loan</Dropdown.Item>
              <Dropdown.Item as={NavLink} to="/newapply">New Apply</Dropdown.Item>
            </DropdownButton>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
