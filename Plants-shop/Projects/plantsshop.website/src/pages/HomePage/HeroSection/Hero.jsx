import  Button  from "@mui/material/Button";
import  Typography from "@mui/material/Typography";
import "./Hero.css";
import Hero2 from "../../../assets/pictures/Hero2.webp";
import Hero1 from "../../../assets/pictures/Hero1.webp";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

const textVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.4 } },
};

const imageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.6 } },
};

export default function Hero() {
    const navigate = useNavigate();
  return (
    <div className="welcome-section">
      <div className="welcome-left">
        <motion.div
          className="text-container"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <Typography variant="h6" className="welcome-title" color={"#ffffff"}>
            Welcome To GreenGlow
          </Typography>
          <Typography
            variant="h3"
            className="welcome-subtitle"
            color={"#ffffff"}
          >
            Find Your Perfect Plant.
          </Typography>
        </motion.div>
        <motion.div
          className="button-container"
          initial="hidden"
          animate="visible"
          variants={buttonVariants}
        >
                  <Button variant="contained" color="primary" className="shop-button" onClick={() => navigate('/shop')}>
            SHOP NOW
          </Button>
        </motion.div>
      </div>
      <div className="welcome-right">
        <motion.img
          src={Hero2}
          className="welcome-image"
          initial="hidden"
          animate="visible"
                  variants={imageVariants}
                  alt="Decorative plant image"
                  loading="lazy"

        />
        <motion.img
                  src={Hero1}
                  loading="lazy"
                  className="welcome-image1"
                  alt="Main hero image"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        />
      </div>
    </div>
  );
}
