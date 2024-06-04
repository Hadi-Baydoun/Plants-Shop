import React from 'react'
import aboutStory from "../../../assets/aboutStory.jpg";
import { Typography } from "@mui/material";
import "./OurStory.css";
export default function OurStory() {
  return (
    <div className="our-story-section">
        <Typography variant="overline" className="section-subtitle">
          OUR STORY
        </Typography>
        <div className="our-story-content">
          <div className="our-story-left">
            <Typography variant="h4" className="section-title">
              Discover GreenGlow and Our Passion for Plants
            </Typography>
          </div>
          <div className="our-story-right">
            <Typography variant="body1" className="section-description">
              Step into the world of GreenGlow, where we’re dedicated to
              bringing the beauty and benefits of plants into your home. Our
              journey is a testament to the love and care we put into each
              plant, ensuring they thrive and elevate your living spaces.
              Discover our story, meet the passionate gardeners who nurture
              these plants, and experience the tranquility and freshness they
              add to your surroundings.
              <br />
              <br /> Explore the heart and soul of our store, where every plant
              is chosen with care, designed to make your moments more serene and
              special.
            </Typography>
          </div>
        </div>
        <img
          src={aboutStory}
          className="about-story-image"
          alt="About GreenGlow"
        />
      </div>
  )
}
