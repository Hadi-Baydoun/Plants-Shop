import { Button, Typography,IconButton,Snackbar, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect, useRef } from "react";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import "../HomeComponents/Arrivals.css";

export default function Arrivals() {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = 4; // Total number of items
  const containerRef = useRef(null);
  const [favorite, setFavorite] = useState(Array(4).fill(false));
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [cart, setCart] = useState(Array(4).fill(false));

  useEffect(() => {
    const container = containerRef.current;
    let animationId;

    const handleScroll = () => {
      container.scrollLeft += 1;
      animationId = requestAnimationFrame(handleScroll);
    };

    animationId = requestAnimationFrame(handleScroll);

    return () => cancelAnimationFrame(animationId);
  }, [slideIndex]);

  const handleNext = () => {
    setSlideIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handlePrev = () => {
    setSlideIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const productItems = [
    {
      image: "https://houseplantshop.com/cdn/shop/products/8-MONSTERA-3_837x837.jpg?v=1627692378",
      name: "Massa",
      price: "$20",
    },
    {
      image: "https://houseplantshop.com/cdn/shop/products/MonsteraDeliciosa_TerraCotta_837x837.jpg?v=1636582102",
      name: "Massa",
      price: "$20",
    },
    {
      image: "https://houseplantshop.com/cdn/shop/products/4_MONSTERA_DELICIOSA_1_837x837.jpg?v=1627692378",
      name: "Massa",
      price: "$20",
    },
    {
      image: "https://images.loox.io/uploads/2024/5/13/mcxSmhxm0.jpg",
      name: "Massa",
      price: "$20",
    },
  ];

  const visibleItems = [
    ...productItems.slice(slideIndex, totalSlides),
    ...productItems.slice(0, slideIndex),
  ];

  useEffect(() => {
    const container = containerRef.current;
    container.scrollTo({
      left: slideIndex * (container.scrollWidth / totalSlides),
      behavior: "smooth",
    });
  }, [slideIndex, totalSlides]);

  const handleFavoriteToggle = (index) => {
    setFavorite((prevFavorite) => {
      const newFavorite = [...prevFavorite];
      newFavorite[index] = !newFavorite[index];
      return newFavorite;
    });
    setSnackbar({
      open: true,
      message: favorite[index] ? "Item removed from wishlist" : "Item added to wishlist"
    });
  };
  const handleCartToggle = (index) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart[index] = !newCart[index];
      return newCart;
    });
    setSnackbar({
      open: true,
      message: cart[index] ? "Item removed from cart" : "Item added to cart"
    });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };
  return (
    <div className="new-arrivals">
        <div className="new-arrivals-title">
          <Typography variant="h3">Most Popular</Typography>
        </div>
        <div className="new-arrivals-products" ref={containerRef}>
          <div className="arrow-icon">
            <ArrowBackIosIcon onClick={handlePrev} className="arrow-icon-left" />
          </div>
          {visibleItems.map((item, index) => (
            <div key={index} className="new-arrivals-product">
              <div className="product-image">
                <img src={item.image} alt={`Product ${index}`} />
              </div>
              <div className="product-info">
                <Typography className="product-name">{item.name}</Typography>
                <div className="product-prices">
                  <Typography className="current-price">{item.price}</Typography>
                </div>
                <div className="product-icons">
                <IconButton onClick={() => handleFavoriteToggle(index)}>
                      {favorite[index] ? (
                        <FavoriteOutlinedIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )}
                    </IconButton>
                    <IconButton onClick={() => handleCartToggle(index)}>
                      {cart[index] ? (
                        <ShoppingCartOutlinedIcon />
                      ) : (
                        <AddShoppingCartOutlinedIcon />
                      )}
                    </IconButton>
                </div>
              </div>
            </div>
          ))}
          <div className="arrow-icon">
            <ArrowForwardIosIcon onClick={handleNext} className="arrow-icon-right" />
          </div>
        </div>
        <Button variant="contained" color="primary" className="arrival-button">
          Explore All
        </Button>
        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
        </Snackbar>
      </div>
  )
}
