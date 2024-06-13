import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import "./ProductDescription.css";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { AuthContext } from '../../../context/AuthContext';
import { handleCartToggle, handleFavoriteToggle, fetchCartItems, fetchWishlistItems } from '../../../utils/HelperFunctions';

export default function ProductDescription() {
    const { id } = useParams();
    const location = useLocation();
    const [product, setProduct] = useState(location.state?.product || null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const { user, cartId, setCartId, wishlistId, setWishlistId, cart, setCart, wishlist, setWishlist } = useContext(AuthContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/Products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        if (!product) {
            fetchProduct();
        }
    }, [id, product]);

    useEffect(() => {
        fetchCartItems(user, setCart, setCartId);
        fetchWishlistItems(user, setWishlist, setWishlistId);
    }, [user, setCartId, setWishlistId]);

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


    const renderStars = () => {
        const stars = [];
        const filledStars = Math.floor(product.rating);

        for (let i = 0; i < 5; i++) {
            if (i < filledStars) {
                stars.push(<StarIcon key={i} className="star filled" />);
            } else {
                stars.push(<StarBorderIcon key={i} className="star" />);
            }
        }

        return stars;
    };


    return (
        <div className="desc-container">
            <div className="desc-flex">
                <div className="image-desc-container">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-desc-image"
                    />
                </div>
                <div className="info-container">
                    <div className="info-header">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="rating">
                            {renderStars()}
                        </div>
                    </div>
                    <div className="product-description">
                        <Typography>
                            {product.description}
                        </Typography>
                        <div className="price-add">
                            <div className="price">${product.price}</div>
                            <div className="buttons">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="arrival-button"
                                    onClick={() => handleAddToCartToggle(product)}
                                >
                                    {cart.some((cartItem) => cartItem.product_id === product.id)
                                        ? 'Remove from Cart'
                                        : 'Add to Cart'}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="arrival-button"
                                    onClick={() => handleAddToWishlistToggle(product)}
                                >
                                    {wishlist.some((wishlistItem) => wishlistItem.product_id === product.id)
                                        ? 'Remove from Wishlist'
                                        : 'Add to Wishlist'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={() => setSnackbar({ open: false, message: "", severity: "success" })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
