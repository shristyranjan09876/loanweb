import React from 'react'
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify }
  from 'react-icons/bs'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Header = ({ OpenSidebar, setIsAuthenticated }) => {

  const navigate = useNavigate()

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate("/")
  };


  return (
    <header className='header'>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-left'>
        <BsSearch className='icon' />
      </div>
      <div className='header-right'>
        {/* <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon'/>   */}
        <button type='button' onClick={handleLogout}
          style={{
            backgroundColor: '#ff4d4d',
            border: '1px solid black',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            gap: '2px',
          }}
        >
          <LogoutIcon />
        </button>

      </div>
    </header>
  )
}

export default Header