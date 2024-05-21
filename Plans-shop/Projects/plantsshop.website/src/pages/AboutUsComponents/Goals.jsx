import { Typography } from "@mui/material";
import "../AboutUsComponents/Goals.css";
export default function Goals() {
  return (
    <div className="vision-goals-section">
        <div className="vision-section">
          <Typography variant="overline" className="vision-title">
            Our Vision
          </Typography>
          <Typography variant="body1" className="vision-description">
            Our vision is to infuse every home with the timeless beauty and
            functionality of plants. We are dedicated to creating elegant,
            handcrafted plant arrangements that elevate everyday living, whether
            it's enjoying a vibrant indoor garden, decorating a space, or
            finding the perfect gift.
          </Typography>
        </div>

        <div className="goals-section">
          <Typography variant="overline" className="goals-title">
            Our Goals
          </Typography>
          <Typography variant="body1" className="goals-description">
            Our values are the foundation upon which GreenGlow is built. We
            prioritize craftsmanship, quality, and creativity in all that we do.
            Integrity, authenticity, and sustainability are at the core of our
            values, ensuring that our plants reflect not just beauty. We believe in the power of
            plants to connect people, transform spaces, and create lasting
            memories.
          </Typography>
        </div>
      </div>
  )
}
