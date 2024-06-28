import './Footer.css';
import LogoBlack from '../../assets/pictures/LogoBlack.svg';
import pay from '../../assets/pictures/pay.webp';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
      <img className="logo" src={LogoBlack} alt="logo"></img>
        
      </div>

      <div className="col">
        <h4>About</h4>
        <a href="/about">About us</a>
        <a href="#">Privacy Policy</a>
        <a href="/contact">Contact us</a>
      </div>

      <div className="col">
        <h4>My Account</h4>
        <a href="/cart">View Cart</a>
        <a href="/wishlist">My Wishlist</a>
              </div>

      
      <div className="col install">
        <h4>Secured Payment Gateways</h4>
        <div className="row">
        <img src={pay} alt="Payment Gateways" />
        </div> 
        <div className="follow">
          <h4>Follow us</h4>
          <div className="icon">
            <i className="fab fa-facebook"><FacebookIcon/></i>
            <i className="fab fa-instagram"><InstagramIcon/></i>
            <i className="fab fa-youtube"><YouTubeIcon/></i>
          </div>
        </div>   
      </div>

      <div className="copyrights">
        <p>Hadi-Baydoun | GreenGlow</p>
      </div>
    </footer>
  );
}
