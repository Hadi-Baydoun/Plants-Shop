import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import "./ProductDescription.css";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { AuthContext } from '../../../context/AuthContext';

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
        const fetchCartItems = async () => {
            try {
                if (user) {
                    const response = await axios.get("/src/assets/Constants.json");
                    const apiBaseUrl = response.data.API_HOST;

                    // Fetch or create cart by customer ID
                    const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
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

        const fetchWishlistItems = async () => {
            try {
                if (user) {
                    const response = await axios.get("/src/assets/Constants.json");
                    const apiBaseUrl = response.data.API_HOST;

                    // Fetch or create wishlist by customer ID
                    const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
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

        fetchCartItems();
        fetchWishlistItems();
    }, [user, setCartId, setWishlistId]);

    const handleCartToggle = async (product) => {
        if (!user) {
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
                    const cartResponse = await axios.get(`${apiBaseUrl}/api/CartItem/getByCustomerId/${user.id}`);
                    if (cartResponse.data && cartResponse.data.id) {
                        currentCartId = cartResponse.data.id;
                    } else {
                        const newCartResponse = await axios.post(`${apiBaseUrl}/api/Cart/add`, {
                            Customer_id: user.id,
                            Customer: {
                                first_Name: user.first_Name,
                                last_Name: user.last_Name,
                                phone_Number: user.phone_Number,
                                email: user.email,
                                password: user.password
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
                            id: user.id,
                            first_Name: user.first_Name,
                            last_Name: user.last_Name,
                            phone_Number: user.phone_Number,
                            email: user.email,
                            password: user.password
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

    const handleFavoriteToggle = async (product) => {
        if (!user) {
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
                    const wishlistResponse = await axios.get(`${apiBaseUrl}/api/WishlistItems/getByCustomerId/${user.id}`);
                    if (wishlistResponse.data && wishlistResponse.data.id) {
                        currentWishlistId = wishlistResponse.data.id;
                    } else {
                        const newWishlistResponse = await axios.post(`${apiBaseUrl}/api/Wishlist/add`, {
                            Customer_id: user.id,
                            Customer: {
                                first_Name: user.first_Name,
                                last_Name: user.last_Name,
                                phone_Number: user.phone_Number,
                                email: user.email,
                                password: user.password
                            }
                        });
                        currentWishlistId = newWishlistResponse.data.id;
                    }
                    setWishlistId(currentWishlistId);
                }

                const subcategoryResponse = await axios.get(`${apiBaseUrl}/api/SubCategories/${product.sub_categories_id}`);
                const subCategory = subcategoryResponse.data;
                const categoryResponse = await axios.get(`${apiBaseUrl}/api/Category/${subCategory.category_id}`);
                const category = categoryResponse.data;

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
                            id: user.id,
                            first_Name: user.first_Name,
                            last_Name: user.last_Name,
                            phone_Number: user.phone_Number,
                            email: user.email,
                            password: user.password
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
                                    onClick={() => handleCartToggle(product)}
                                >
                                    {cart.some((cartItem) => cartItem.product_id === product.id)
                                        ? 'Remove from Cart'
                                        : 'Add to Cart'}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="arrival-button"
                                    onClick={() => handleFavoriteToggle(product)}
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
