import { Typography, Button } from "@mui/material";
import reasonPlant from "../../../assets/pictures/reasonPlant.jpeg";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Reasons.css";

const reasonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
};

const imageVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } }
};

export default function Reasons() {
  const reasons = [
    "' To give as a gift '",
    "' Grow my own garden '",
    "' To reduce stress '",
    "' To purify the air surrounding me '",
    "' To decorate my house! '",
    "' So I always have a friend close '",
    "' To add natural beauty to my space '",
    "' To enjoy the therapeutic benefits of gardening '",
    "' To create a serene environment '",
    "' To improve my mental health '",
    "' To enhance my cooking with fresh herbs '",
    "' To create a sustainable living space '",
    "' To add color and life to my home '",
    "' To enjoy the fragrance of flowers '",
    "' To boost my creativity '",
    "' To cultivate a hobby '",
    "' To improve the aesthetics of my office '",
    "' To create a natural privacy screen '",
    "' To commemorate a special occasion '",
    "' To enjoy seasonal changes in my garden '"
  ];

  const [currentReason, setCurrentReason] = useState(reasons[0]);
  const [reasonKey, setReasonKey] = useState(0); // Added to force update on reason change

  const showRandomReason = () => {
    const randomIndex = Math.floor(Math.random() * reasons.length);
    setCurrentReason(reasons[randomIndex]);
    setReasonKey(reasonKey + 1); // Update key to trigger animation
  };

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="reason-section" ref={ref}>
      <motion.div
        className="left-side"
        initial="hidden"
        animate={controls}
        variants={imageVariants}
      >
        <div className="reason-image">
          <img src={reasonPlant} alt="Plant" />
        </div>
      </motion.div>
      <div className="right-side">
        <Typography variant="h4" gutterBottom>
          Best Reasons To Buy A Plant...
        </Typography>
        <motion.div
          key={reasonKey}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={reasonVariants}
        >
          <Typography className="reasons" variant="h6">
            {currentReason}
          </Typography>
        </motion.div>
        <Button
          variant="contained"
          color="primary"
          className="reason-button"
          onClick={showRandomReason}
        >
          See Another Reason
        </Button>
      </div>
    </div>
  );
}
