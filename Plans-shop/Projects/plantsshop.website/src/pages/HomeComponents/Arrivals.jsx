import { Button, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect, useRef } from "react";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import axios from 'axios';
import "../HomeComponents/Arrivals.css";
import { useNavigate } from 'react-router-dom';

export default function Arrivals({ loggedInUser, cartId, setCartId }) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [items, setItems] = useState([]);
    const totalSlides = 4;
    const containerRef = useRef(null);
    const [favorite, setFavorite] = useState(Array(15).fill(false));
    const [snackbar, setSnackbar] = useState({ open: false, message: "" });
    const [cart, setCart] = useState(Array(15).fill(false));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;
                const productsResponse = await axios.get(`${apiBaseUrl}/api/Products/all`);
                const fetchedItems = productsResponse.data.slice(0, 15); 
                setItems(fetchedItems);
                setFavorite(Array(fetchedItems.length).fill(false));
                setCart(Array(fetchedItems.length).fill(false));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

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

    const handleCartToggle = async (product) => {
        if (!loggedInUser) {
            alert("Please log in to add items to the cart.");
            return;
        }

        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            // Check if the cart exists for the logged-in user
            let currentCartId = cartId;
            if (!currentCartId) {
                const cartResponse = await axios.get(`${apiBaseUrl}/api/CartItem/getByCustomerId/${loggedInUser.id}`);
                if (cartResponse.data && cartResponse.data.id) {
                    currentCartId = cartResponse.data.id;
                } else {
                    const newCartResponse = await axios.post(`${apiBaseUrl}/api/Cart/add`, {
                        Customer_id: loggedInUser.id,
                        Customer: {
                            first_Name: loggedInUser.first_Name,
                            last_Name: loggedInUser.last_Name,
                            phone_Number: loggedInUser.phone_Number,
                            email: loggedInUser.email,
                            password: loggedInUser.password
                        }
                    });
                    currentCartId = newCartResponse.data.id;
                }
                setCartId(currentCartId);
            }

            // Fetch subcategory and category details
            const subcategoryResponse = await axios.get(`${apiBaseUrl}/api/SubCategories/${product.sub_categories_id}`);
            const subCategory = subcategoryResponse.data;
            const categoryResponse = await axios.get(`${apiBaseUrl}/api/Category/${subCategory.category_id}`);
            const category = categoryResponse.data;

            // Calculate total
            const quantity = 1;  // Default quantity
            const total = product.price * quantity;

            // Add item to cart with all necessary details
            const cartItem = {
                cart_id: currentCartId,
                product_id: product.id,
                quantity: quantity,
                total: total,
                Product: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    sub_categories_id: product.sub_categories_id,
                    SubCategories: {
                        id: subCategory.id,
                        name: subCategory.name,
                        Category: {
                            id: category.id,
                            name: category.name
                        }
                    }
                },
                Cart: {
                    id: currentCartId,
                    Customer: {
                        id: loggedInUser.id,
                        first_Name: loggedInUser.first_Name,
                        last_Name: loggedInUser.last_Name,
                        phone_Number: loggedInUser.phone_Number,
                        email: loggedInUser.email,
                        password: loggedInUser.password
                    }
                }
            };

            await axios.post(`${apiBaseUrl}/api/CartItem/add`, cartItem);

            setCart((prevCart) => {
                if (prevCart.some((cartItem) => cartItem.product_id === product.id)) {
                    return prevCart.filter((cartItem) => cartItem.product_id !== product.id);
                } else {
                    return [...prevCart, cartItem];
                }
            });
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
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
                    item && item.image_url ? (
                        <div key={index} className="new-arrivals-product">
                            <div className="product-image">
                                <img src={item.image_url} alt={`Product ${index}`} />
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
                                    <IconButton onClick={() => handleCartToggle(item)}>
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
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
