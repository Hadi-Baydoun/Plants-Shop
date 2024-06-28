import "./AboutUs.css";
import benefits1 from "../../../assets/pictures/benefits1.webp";
import benefits2 from "../../../assets/pictures/benefits2.webp";
import benefits3 from "../../../assets/pictures/benefits3.webp"; 
import benefits4 from "../../../assets/pictures/benefits4.webp";
import benefits5 from "../../../assets/pictures/benefits5.webp";
import benefits6 from "../../../assets/pictures/benefits6.webp";
import benefitsBig from "../../../assets/pictures/benefitsBig.webp";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
export default function AboutUsHome() {
    const navigate = useNavigate();
  return (
    <div className="story-area">
      <div className="story-left-side">
        <Typography variant="h4" component="h2" style={{ fontWeight: 'bold' }}>
          We Inspire & Connect Through Greener Spaces
        </Typography>
                <div className="benefits">
                    <ul>
                        <li>
                            <LazyLoadImage
                                src={benefits1}
                                className="benefit-image"
                                rel="preload"
                                alt="Grown with Love & Delivered with Care"

                            />
                            <p>Grown with Love & Delivered with Care</p>
                        </li>
                        <li>
                            <LazyLoadImage
                              src={benefits2}
                              rel="preload"
                              className="benefit-image"
                              alt="Shipped Fresh From The Nursery"

                            />
                            <p>Shipped Fresh From The Nursery</p>
                        </li>
                        <li>
                            <LazyLoadImage
                              src={benefits3}
                              rel="preload"
                              className="benefit-image"
                              alt="Happy Plant 30 Day Guarantee"

                            />
                            <p>Happy Plant 30 Day Guarantee</p>
                        </li>
                    </ul>
                    <ul>
                        <li>
                            <LazyLoadImage
                                src={benefits4}
                                className="benefit-image"
                                alt="Full Grown Plants - Right to Your Door"
                                rel="preload"

                            />
                            <p>Full Grown Plants - Right to Your Door</p>
                        </li>
                        <li>
                            <LazyLoadImage
                                src={benefits5}
                                className="benefit-image"
                                alt="Expert advice - support@greenglow.com"
                                rel="preload"

                            />
                            <p>Expert advice - support@greenglow.com</p>
                        </li>
                        <li>
                            <LazyLoadImage
                                src={benefits6}
                                className="benefit-image"
                                alt="Care Instructions With Every Order"
                                rel="preload"

                            />
                            <p>Care Instructions With Every Order</p>
                        </li>
                    </ul>
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className="story-button"
                    onClick={() => navigate('/about')}
                >
                    Read Our Story
                </Button>
            </div>
            <div className="story-right-side">
                <LazyLoadImage
                    src={benefitsBig}
                    className="benefit-big-image"
                    alt="Large Benefit"
                    rel="preload"

                />
            </div>
        </div>
    )
}

