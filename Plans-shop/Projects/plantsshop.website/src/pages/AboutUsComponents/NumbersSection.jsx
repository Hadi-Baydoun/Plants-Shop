import "../AboutUsComponents/NumbersSection.css";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";

const Counter = ({ end, suffix }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);

      const updateCount = () => {
        start += increment;
        if (start < end) {
          setCount(Math.ceil(start));
          requestAnimationFrame(updateCount);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [inView, end]);

  return (
    <div ref={ref}>
      <Typography variant="h2">
        {count.toLocaleString()}
        {suffix}
      </Typography>
    </div>
  );
};

export default function NumbersSection() {
  return (
    <div className="numbers-section">
      <Typography variant="h4" className="numbers-title">
        Numbers Speak For Themselves!
      </Typography>
      <div className="number-item">
        <Counter end={5000} suffix="+" />
        <Typography variant="subtitle1">Delivered Products</Typography>
      </div>
      <div className="number-item">
        <Counter end={800} suffix="+" />
        <Typography variant="subtitle1">Product Categories</Typography>
      </div>
      <div className="number-item">
        <Counter end={10} suffix="+" />
        <Typography variant="subtitle1">Years of Experience</Typography>
      </div>
    </div>
  );
}
