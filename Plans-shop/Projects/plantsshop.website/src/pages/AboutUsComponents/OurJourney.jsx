import React from 'react'
import { Typography } from "@mui/material";
import aboutJourney from "../../assets/aboutJourney.jpg";
import "../AboutUsComponents/OurJourney.css";
export default function OurJourney() {
  return (
    <div className="our-journey">
        <img src={aboutJourney} className="journey-image" alt="Our Journey" />
        <div className="our-journey-content">
          <Typography variant="overline" className="journey-subtitle">
            OUR JOURNEY
          </Typography>
          <Typography variant="h4" className="journey-title">
            Experience the Journey of GreenGlow
          </Typography>
          <Typography variant="body1" className="journey-description">
            Welcome to GreenGlow, where our passion for plants drives everything
            we do. Our story began with a simple love for nature and has grown
            into a mission to bring the beauty and benefits of plants to homes
            everywhere. Each plant we offer is nurtured with care and expertise,
            ensuring it thrives and transforms your space.
            <br />
            <br /> At GreenGlow, every plant is more than just a product, It's a
            piece of our journey and a promise of a greener, more vibrant world
            for you.
          </Typography>
        </div>
      </div>
  )
}
