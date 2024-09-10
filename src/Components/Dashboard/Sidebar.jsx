import React from 'react';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <AccountCircleIcon className='icon_header' /> Admin Panel
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/dashboard">
            <BsGrid1X2Fill className='icon' /> Home
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/active-loans">
            <BsFillArchiveFill className='icon' /> Active Loans
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/payments-today">
            <BsFillGrid3X3GapFill className='icon' /> Payments Today
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/borrowers">
            <BsPeopleFill className='icon' /> Borrowers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/loan-types">
            <BsMenuButtonWideFill className='icon' /> Loan Types
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/userdashb">
            <AccountCircleIcon className='icon' /> Add Users
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/userlist">
            <AccountCircleIcon className='icon' /> Users List
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/settings">
            <BsFillGearFill className='icon' /> Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
