import { Divider } from "@mui/material";
import "./Features.css";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const shippingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, 
    threshold: 0.1, 
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      className="shipping_area"
      initial="hidden"
      animate={controls}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.5,
          },
        },
      }}
    >
      <div className="row" ref={ref}>
        <motion.div className="single_shipping" variants={shippingVariants}>
          <div className="shipping_icone">
            <img src="//lukani-demo.myshopify.com/cdn/shop/files/shipping1.png?v=1613792728" alt="Free Delivery" />
          </div>
          <div className="shipping_content">
            <h3>Free Delivery</h3>
            <p>
              Free shipping around the world for all <br /> orders over $120
            </p>
          </div>
        </motion.div>

        <Divider
          orientation="vertical"
          flexItem
          style={{ margin: "0 20px", height: "100px" }}
        />

        <motion.div className="single_shipping" variants={shippingVariants}>
          <div className="shipping_icone">
            <img src="//lukani-demo.myshopify.com/cdn/shop/files/shipping2.png?v=1613792729" alt="Safe Payment" />
          </div>
          <div className="shipping_content">
            <h3>Safe Payment</h3>
            <p>
              With our payment gateway, don’t worry <br />
              about your information
            </p>
          </div>
        </motion.div>

        <Divider
          orientation="vertical"
          flexItem
          style={{ margin: "0 20px", height: "100px" }}
        />

        <motion.div className="single_shipping" variants={shippingVariants}>
          <div className="shipping_icone">
            <img src="//lukani-demo.myshopify.com/cdn/shop/files/shipping3.png?v=1613792729" alt="Friendly Services" />
          </div>
          <div className="shipping_content">
            <h3>Friendly Services</h3>
            <p>
              You have 30-day return guarantee for <br />
              every single order
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
