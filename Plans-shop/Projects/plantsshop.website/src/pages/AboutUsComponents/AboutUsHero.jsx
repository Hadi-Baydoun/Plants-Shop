import { Typography } from "@mui/material";
import aboutUsMainPic from "../../assets/aboutUsMainPic.jpg";
import "../AboutUsComponents/AboutUsHero.css";

export default function AboutUsHero() {
  return (
    <div className="aboutus-section">
      <div className="aboutus-section-title">
        <Typography variant="h2">About Us</Typography>
      </div>
      <div className="aboutus-content">
        <div className="aboutus-left">
          <Typography variant="h6" className="aboutus-title" color={"#ffffff"}>
            Welcome to GreenGlow. Our mission is to bring the joy of nature
            into your home, We believe that plants have the power to transform spaces
            and uplift spirits. Join us in cultivating a greener, more vibrant
            world!
          </Typography>
        </div>
        <div className="aboutus-right">
          <img src={aboutUsMainPic} className="aboutus-image1" alt="About Us" />
        </div>
      </div>
    </div>
    
  )
}
