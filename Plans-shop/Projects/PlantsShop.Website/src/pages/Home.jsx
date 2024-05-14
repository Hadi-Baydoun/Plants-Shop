import { Typography, Button } from '@mui/material';
import '../Home.css';
import Hero2 from '../assets/Hero2.jpg';
import Hero1 from '../assets/Hero1.jpg';


export default function Home() {
  
  return (
    
    <div className="home">
    <div className='welcome-section'>
      <div className="welcome-left">
        <Typography variant="h6" className="welcome-title" color={'#ffffff'}>
          Welcome To GreenGlow
        </Typography>
        <Typography variant="h3" className="welcome-subtitle" color={'#ffffff'}>
          Find Your Perfect Plant.
        </Typography>
        {/* <Typography variant="h6" className="welcome-title" color={'#ffffff'}>
          Starting at 40$
        </Typography> */}
        <Button variant="contained" color="primary" className="shop-button">
          SHOP NOW
        </Button>
      </div>
      <div className="welcome-right">
        <img src={Hero2} className="welcome-image" />
        <img src={Hero1} className="welcome-image1" />
      </div>
    </div>
    <div className="about">asdads</div>
    </div>
  );
}
