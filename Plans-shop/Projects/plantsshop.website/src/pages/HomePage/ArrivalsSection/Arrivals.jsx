import { Button, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect, useRef } from "react";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import axios from 'axios';
import "./Arrivals.css";
import { useNavigate } from 'react-router-dom';

export default function Arrivals({ loggedInUser, cartId, setCartId, wishlistId, setWishlistId }) {
    const [slideIndex, setSlideIndex] = useState(0);
    const [items, setItems] = useState([]);
    const totalSlides = 4;
    const containerRef = useRef(null);
    const [favorite, setFavorite] = useState(Array(15).fill(false));
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
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
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCartItems = async () => {
            try {
                if (loggedInUser) {
                    const response = await axios.get("/src/assets/Constants.json");
                    const apiBaseUrl = response.data.API_HOST;

                    // Fetch or create cart by customer ID
                    const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/getOrCreateCartByCustomerId/${loggedInUser.id}`);
                    const currentCartId = cartResponse.data.id;

                    // Fetch cart items by cart ID
                    const cartItemsResponse = await axios.get(`${apiBaseUrl}/api/CartItem/getByCartId/${currentCartId}`);
                    setCart(cartItemsResponse.data);

                    // Set cart ID for future use
                    setCartId(currentCartId);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchProducts();
        fetchCartItems();
    }, [loggedInUser, setCartId]);

    useEffect(() => {

        const fetchProducts = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;
                const productsResponse = await axios.get(`${apiBaseUrl}/api/Products/all`);
                const fetchedItems = productsResponse.data.slice(0, 15);
                setItems(fetchedItems);
                setFavorite(Array(fetchedItems.length).fill(false));
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

    const fetchWishlistItems = async () => {
        try {
            if (loggedInUser) {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;

                // Fetch or create wishlist by customer ID
                const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getOrCreateWishlistByCustomerId/${loggedInUser.id}`);
                const currentWishlistId = wishlistResponse.data.id;

                // Fetch wishlist items by wishlist ID
                const wishlistItemsResponse = await axios.get(`${apiBaseUrl}/api/WishlistItems/getByWishlistId/${currentWishlistId}`);
                setWishlist(wishlistItemsResponse.data);

                // Set wishlist ID for future use
                setWishlistId(currentWishlistId);
            }
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        }
    };

    fetchProducts();
    fetchWishlistItems();
}, [loggedInUser, setWishlistId]);

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

    const handleCartToggle = async (product) => {
        if (!loggedInUser) {
            alert("Please log in to add items to the cart.");
            return;
        }

        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            // Check if the product is already in the cart
            const existingCartItem = cart.find((item) => item.product_id === product.id);

            if (existingCartItem) {
                // If the product is in the cart, remove it
                await axios.delete(`${apiBaseUrl}/api/CartItem/delete/${existingCartItem.id}`);
                setCart((prevCart) => prevCart.filter((item) => item.id !== existingCartItem.id));

                // Show snackbar for item removed
                setSnackbar({ open: true, message: "Item removed from cart", severity: "warning" });
            } else {
                // If the product is not in the cart, add it
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
                setCart((prevCart) => [...prevCart, cartItem]);

                // Show snackbar for item added
                setSnackbar({ open: true, message: "Item added to cart", severity: "success" });
            }
        } catch (error) {
            console.error("Error adding/removing item to/from cart:", error);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ open: false, message: "", severity: "success" });
    };

    const handleFavoriteToggle = async (product) => {
        if (!loggedInUser) {
            alert("Please log in to add items to the wishlist.");
            return;
        }

        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            // Check if the product is already in the wishlist
            const existingWishlistItem = wishlist.find((item) => item.product_id === product.id);

            if (existingWishlistItem) {
                // If the product is in the wishlist, remove it
                await axios.delete(`${apiBaseUrl}/api/WishlistItems/delete/${existingWishlistItem.id}`);
                setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== existingWishlistItem.id));

                // Show snackbar for item removed
                setSnackbar({ open: true, message: "Item removed from wishlist", severity: "warning" });
            } else {
                // If the product is not in the wishlist, add it
                let currentWishlistId = wishlistId;
                if (!currentWishlistId) {
                    const wishlistResponse = await axios.get(`${apiBaseUrl}/api/WishlistItems/getByCustomerId/${loggedInUser.id}`);
                    if (wishlistResponse.data && wishlistResponse.data.id) {
                        currentWishlistId = wishlistResponse.data.id;
                    } else {
                        const newWishlistResponse = await axios.post(`${apiBaseUrl}/api/Wishlist/add`, {
                            Customer_id: loggedInUser.id,
                            Customer: {
                                first_Name: loggedInUser.first_Name,
                                last_Name: loggedInUser.last_Name,
                                phone_Number: loggedInUser.phone_Number,
                                email: loggedInUser.email,
                                password: loggedInUser.password
                            }
                        });
                        currentWishlistId = newWishlistResponse.data.id;
                    }
                    setWishlistId(currentWishlistId);
                }

                // Fetch subcategory and category details
                const subcategoryResponse = await axios.get(`${apiBaseUrl}/api/SubCategories/${product.sub_categories_id}`);
                const subCategory = subcategoryResponse.data;
                const categoryResponse = await axios.get(`${apiBaseUrl}/api/Category/${subCategory.category_id}`);
                const category = categoryResponse.data;

                // Add item to wishlist with all necessary details
                const wishlistItem = {
                    wishlist_id: currentWishlistId,
                    product_id: product.id,
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
                    Wishlist: {
                        id: currentWishlistId,
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

                await axios.post(`${apiBaseUrl}/api/WishlistItems/add`, wishlistItem);
                setWishlist((prevWishlist) => [...prevWishlist, wishlistItem]);

                // Show snackbar for item added
                setSnackbar({ open: true, message: "Item added to wishlist", severity: "success" });
            }
        } catch (error) {
            console.error("Error adding/removing item to/from wishlist:", error);
        }
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
                        <div key={index} className="new-arrivals-product" onClick={() => handleItemClick(item)}>
                            <div className="product-image">
                                <img src={item.image_url} alt={`Product ${index}`} />
                            </div>
                            <div className="product-info">
                                <Typography className="product-name">{item.name}</Typography>
                                <div className="product-prices">
                                    <Typography className="current-price">{item.price}</Typography>
                                </div>
                                <div className="product-icons">
                                    <IconButton onClick={() => handleFavoriteToggle(item)}>
                                        {wishlist.some((wishlistItem) => wishlistItem.product_id === item.id) ? (
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
