import "./Testimonials.css";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    quote:
      "The plants from this shop are absolutely beautiful and healthy. They have transformed my home into a green oasis. Highly recommend!",
    author: "EMMA",
  },
  {
    quote:
      "I love the variety of plants available here. The customer service is excellent and the delivery was fast. My plants arrived in perfect condition.",
    author: "LIAM",
  },
  {
    quote:
      "This is my go-to shop for all things green. The quality of the plants is unmatched and they have a great selection of unique and rare plants.",
    author: "NOAH",
  },
  {
    quote:
      "I bought a few plants as gifts for my friends and they were thrilled. The plants are healthy and thriving. Thank you for the great service!",
    author: "OLIVIA",
  },
];

const quoteVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -50 : 50,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 50 : -50,
    transition: { duration: 0.5 },
  }),
};

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("center");
    }
  }, [controls, inView]);

  useEffect(() => {
    controls.start("enter").then(() => controls.start("center"));
  }, [currentTestimonial, controls, direction]);

  return (
    <div className="testimonials" ref={ref}>
      <Typography variant="h4" className="testimonials-title">
        What Our Customers Say?
      </Typography>
      <hr className="Divider" />
      <div className="testimonial-content">
        <div className="testimonial-text">
          <motion.div
            key={currentTestimonial}
            custom={direction}
            initial="enter"
            animate="center"
            exit="exit"
            variants={quoteVariants}
          >
            <Typography variant="body1" className="quote">
              " {testimonials[currentTestimonial].quote} "
            </Typography>
          </motion.div>
          <div className="testimonial-author">
            <Typography variant="subtitle1" className="author-name">
              {testimonials[currentTestimonial].author}
            </Typography>
            <div className="testimonial-arrows">
              <IconButton onClick={handlePrev}>
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton onClick={handleNext}>
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
