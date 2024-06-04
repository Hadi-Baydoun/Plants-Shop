import { Typography } from "@mui/material";
import benefitsBig from "../../../assets/pictures/benefitsBig.jpg";
import "../../AboutUsPage/HeroSection/AboutUsHero.css";
export default function ContactHero() {
  return (
    <div className="aboutus-section">
      <div className="aboutus-section-title">
        <Typography variant="h2">Contact Us</Typography>
      </div>
      <div className="aboutus-content">
        <div className="aboutus-left">
          <Typography variant="h6" className="aboutus-title" color={"#ffffff"}>
            We're here to assist you in any way we can. Whether you have
            questions about our products, need personalized recommendations, or
            simply want to connect with our team, don't hesitate to reach out.
          </Typography>
        </div>
        <div className="aboutus-right">
          <img src={benefitsBig} className="aboutus-image1" alt="About Us" />
        </div>
      </div>
    </div>
  );
}
