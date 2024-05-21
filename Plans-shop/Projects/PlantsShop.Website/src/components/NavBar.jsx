import './NavBar.css';
import { useState } from 'react';
import logo from '../assets/logo.png';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export const NavBar = () => {
  const [menu, setMenu] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='navbar'>
      <img className='logo' src={logo} alt="Logo" />
      <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        <li onClick={() => { setMenu("Home"); setIsMenuOpen(false); }} className={menu === "Home" ? "active" : ""}>Home</li>
        <li onClick={() => { setMenu("Shop"); setIsMenuOpen(false); }} className={menu === "Shop" ? "active" : ""}>Shop</li>
        <li onClick={() => { setMenu("About Us"); setIsMenuOpen(false); }} className={menu === "About Us" ? "active" : ""}>About Us</li>
        <li onClick={() => { setMenu("Contact"); setIsMenuOpen(false); }} className={menu === "Contact" ? "active" : ""}>Contact</li>
        {isMenuOpen && (
          <li className="close-icon" onClick={toggleMenu}>
            <CloseIcon />
          </li>
        )}
      </ul>
      <div className='navbar-right'>
        <div className="navbar-search-icon">
          <ShoppingBasketOutlinedIcon className="navbar-icon" />
        </div>
        <Person2OutlinedIcon className="navbar-icon" />
        {!isMenuOpen && (
          <div className="navbar-hamburger" onClick={toggleMenu}>
            <MenuIcon className="navbar-icon" />
          </div>
        )}
      </div>
    </div>
  );
};
