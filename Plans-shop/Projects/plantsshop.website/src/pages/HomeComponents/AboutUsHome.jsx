import "../HomeComponents/AboutUs.css";
import benefits1 from "../../assets/benefits1.jpg";
import benefits2 from "../../assets/benefits2.jpg";
import benefits3 from "../../assets/benefits3.jpg";
import benefits4 from "../../assets/benefits4.jpg";
import benefits5 from "../../assets/benefits5.jpg";
import benefits6 from "../../assets/benefits6.jpg";
import benefitsBig from "../../assets/benefitsBig.jpg";
import { Typography, Button } from "@mui/material";
export default function AboutUsHome() {
  return (
    <div className="story-area">
      <div className="story-left-side">
        <Typography variant="h4" component="h2" style={{ fontWeight: 'bold' }}>
          We Inspire & Connect Through Greener Spaces
        </Typography>
        <div className="benefits">
          <ul>
            <li>
              <img
                src={benefits1}
                className="benefit-image"
                alt="Grown with Love & Delivered with Care"
              />
              <p>Grown with Love & Delivered with Care</p>
            </li>
            <li>
              <img
                src={benefits2}
                className="benefit-image"
                alt="Shipped Fresh From The Nursery"
              />
              <p>Shipped Fresh From The Nursery</p>
            </li>
            <li>
              <img
                src={benefits3}
                className="benefit-image"
                alt="Happy Plant 30 Day Guarantee"
              />
              <p>Happy Plant 30 Day Guarantee</p>
            </li>
          </ul>
          <ul>
            <li>
              <img
                src={benefits4}
                className="benefit-image"
                alt="Full Grown Plants - Right to Your Door"
              />
              <p>Full Grown Plants - Right to Your Door</p>
            </li>
            <li>
              <img
                src={benefits5}
                className="benefit-image"
                alt="Expert advice - support@greenglow.com"
              />
              <p>Expert advice - support@greenglow.com</p>
            </li>
            <li>
              <img
                src={benefits6}
                className="benefit-image"
                alt="Care Instructions With Every Order"
              />
              <p>Care Instructions With Every Order</p>
            </li>
          </ul>
        </div>
        <Button
          variant="contained"
          color="primary"
          className="story-button"
        >
          Read Our Story
        </Button>
      </div>
      <div className="story-right-side">
        <img src={benefitsBig} className="benefit-big-image" alt="Large Benefit"/>
      </div>
    </div>
  )
}
