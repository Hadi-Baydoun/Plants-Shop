import { Button, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect, useRef, useContext } from "react";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import axios from 'axios';
import "./Arrivals.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { handleCartToggle, handleFavoriteToggle, fetchCartItems, handleCloseSnackbar, fetchWishlistItems } from '../../../utils/HelperFunctions';

export default function Arrivals() {
    const [slideIndex, setSlideIndex] = useState(0);
    const [items, setItems] = useState([]);
    const totalSlides = 4;
    const containerRef = useRef(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();
    const { user, cartId, setCartId, wishlistId, setWishlistId, cart, setCart, wishlist, setWishlist } = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;
                const productsResponse = await axios.get(`${apiBaseUrl}/api/Products/all`);
                const fetchedItems = productsResponse.data.slice(0, 15);
                setItems(fetchedItems);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
        fetchCartItems(user, setCart, setCartId);
        fetchWishlistItems(user,setWishlist,setWishlistId);
    }, [user, setCartId, setWishlistId, setCart, setWishlist]);

    const handleNext = () => {
        setSlideIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const handlePrev = () => {
        setSlideIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    const visibleItems = [];
    for (let i = 0; i < totalSlides; i++) {
        visibleItems.push(items[(slideIndex + i) % items.length]);
    }

    useEffect(() => {
        const container = containerRef.current;
        container.scrollTo({
            left: 0,
            behavior: "smooth",
        });
    }, [slideIndex]);

    const handleAddToCartToggle = (product) => {
        handleCartToggle(
            product,
            user,
            cart,
            cartId,
            setCart,
            setCartId,
            (snackbarMessage) => setSnackbar((prevState) => ({ ...prevState, open: true, message: snackbarMessage })),
            (snackbarSeverity) => setSnackbar((prevState) => ({ ...prevState, open: true, severity: snackbarSeverity }))
        );
    };

    const handleAddToWishlistToggle = (product) => {
        handleFavoriteToggle(
            product,
            user,
            wishlist,
            wishlistId,
            setWishlist,
            setWishlistId,
            (snackbarState) => setSnackbar((prevState) => ({ ...prevState, ...snackbarState }))
        );
    };

    const handleItemClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
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
                    item && item.image_url ? (
                        <div key={index} className="new-arrivals-product">
                            <div className="product-image" onClick={() => handleItemClick(item)}>
                                <img src={item.image_url} alt={`Product ${index}`} />
                            </div>
                            <div className="product-info">
                                <Typography className="product-name">{item.name}</Typography>
                                <div className="product-prices">
                                    <Typography className="current-price">{item.price}</Typography>
                                </div>
                                <div className="product-icons">
                                    <IconButton onClick={() => handleAddToWishlistToggle(item)}>
                                        {wishlist.some((wishlistItem) => wishlistItem.product_id === item.id) ? (
                                            <FavoriteOutlinedIcon />
                                        ) : (
                                            <FavoriteBorderOutlinedIcon />
                                        )}
                                    </IconButton>
                                    <IconButton onClick={() => handleAddToCartToggle(item)}>
                                        {cart.some((cartItem) => cartItem.product_id === item.id) ? (
                                            <ShoppingCartOutlinedIcon />
                                        ) : (
                                            <AddShoppingCartOutlinedIcon />
                                        )}
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ) : null
                ))}
                <div className="arrow-icon">
                    <ArrowForwardIosIcon onClick={handleNext} className="arrow-icon-right" />
                </div>
            </div>
            <Button variant="contained" color="primary" className="arrival-button" onClick={() => navigate('/shop')}>
                Explore All
            </Button>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar(setSnackbar)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar(setSnackbar)} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
