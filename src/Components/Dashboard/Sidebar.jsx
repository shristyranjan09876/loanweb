import React from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsMenuButtonWideFill, BsFillGearFill } from 'react-icons/bs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const Sidebar = ({ openSidebarToggle, OpenSidebar }) => {
  const adminLinks = [
    { to: "/dashboard", icon: <BsGrid1X2Fill />, label: "Home" },
    { to: "/active-loans", icon: <BsFillArchiveFill />, label: "Active Loans" },
    { to: "/payments-today", icon: <BsFillGrid3X3GapFill />, label: "Payments Today" },
    { to: "/borrowers", icon: <BsPeopleFill />, label: "Borrowers" },
    { to: "/loan-types", icon: <BsMenuButtonWideFill />, label: "Loan Types" },
    { to: "/adduser", icon: <AccountCircleIcon />, label: "Add Employee" },
    { to: "/userlist", icon: <AccountCircleIcon />, label: "Employee List" },
    { to: "/settings", icon: <BsFillGearFill />, label: "Settings" },
  ];

  const employeeLinks = [
    { to: "/dashboard", icon: <BsGrid1X2Fill />, label: "Home" },
    { to: "/active-loans", icon: <BsFillArchiveFill />, label: "Active Loans" },
    { to: "/payments-today", icon: <BsFillGrid3X3GapFill />, label: "Payments Today" },
    { to: "/loanapplic", icon: <BsFillGrid3X3GapFill />, label: "Loan Application" },
    { to: "/borrowers", icon: <BsPeopleFill />, label: "Borrowers" },
  ];


  const role = localStorage.getItem("role")
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
      </ul>
    </aside>
  );
};

export default Sidebar;
