import './NavBar.css';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export const NavBar = ({setShowLogin}) => {
  const [menu, setMenu] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      {!isScrolled ? (
        <Link to="/" onClick={() => setMenu("Home")}>
          <img className='logo' src={logo} alt="Logo" />
        </Link>
      ) : (
        <Link to="/" onClick={() => setMenu("Home")}>
          <div className="scrolled-logo">GreenGlow</div>
        </Link>
      )}
      <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        <li className={menu === "Home" ? "active" : ""}>
          <Link to="/" onClick={() => { setMenu("Home"); setIsMenuOpen(false); }}>Home</Link>
        </li>
        <li className={menu === "Shop" ? "active" : ""}>
          <Link to="/shop" onClick={() => { setMenu("Shop"); setIsMenuOpen(false); }}>Shop</Link>
        </li>
        <li className={menu === "About Us" ? "active" : ""}>
          <Link to="/about" onClick={() => { setMenu("About Us"); setIsMenuOpen(false); }}>About Us</Link>
        </li>
        <li className={menu === "Contact" ? "active" : ""}>
          <Link to="/contact" onClick={() => { setMenu("Contact"); setIsMenuOpen(false); }}>Contact</Link>
        </li>
        {isMenuOpen && (
          <li className="close-icon" onClick={toggleMenu}>
            <CloseIcon />
          </li>
        )}
      </ul>
      <div className='navbar-right'>
        <div className="navbar-search-icon">
          <Link to='/cart'><ShoppingBasketOutlinedIcon className="navbar-icon" /></Link>
        </div>
        <Person2OutlinedIcon className="navbar-icon" onClick={()=>setShowLogin(true)}/>
        {!isMenuOpen && (
          <div className="navbar-hamburger" onClick={toggleMenu}>
            <MenuIcon className="navbar-icon" />
          </div>
        )}
      </div>
    </div>
  );
};
