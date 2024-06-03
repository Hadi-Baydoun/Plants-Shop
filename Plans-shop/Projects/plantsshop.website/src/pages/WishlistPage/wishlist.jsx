import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./wishlist.css";
import {
    IconButton,
    Box,
    Button,
    Snackbar,
    Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Wishlist({ loggedInUser, setWishlistId, setCustomerId, cartId, setCartId }) {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlistItems = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;

                // Fetch wishlist by customer ID
                const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getByCustomerId/${loggedInUser.id}`);
                const currentWishlistId = wishlistResponse.data.id;

                // Fetch wishlist items by wishlist ID
                const wishlistItemsResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getByWishlistId/${currentWishlistId}`);
                setWishlistItems(wishlistItemsResponse.data);

                // Set wishlist ID and customer ID
                setWishlistId(currentWishlistId);
                setCustomerId(loggedInUser.id);
            } catch (error) {
                console.error('Error fetching wishlist items:', error);
            }
        };

        if (loggedInUser) {
            fetchWishlistItems();
        }
    }, [loggedInUser]);

    const removeFromWishlist = async (id) => {
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            // Pass the id as a query parameter
            await axios.delete(`${apiBaseUrl}/api/Wishlist/delete`, { params: { id: id } });
            setWishlistItems(wishlistItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };


    const addToCart = async (product) => {
        if (!loggedInUser) {
            alert("Please log in to add items to the cart.");
            return;
        }

        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

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

            const subcategoryResponse = await axios.get(`${apiBaseUrl}/api/SubCategories/${product.sub_categories_id}`);
            const subCategory = subcategoryResponse.data;
            const categoryResponse = await axios.get(`${apiBaseUrl}/api/Category/${subCategory.category_id}`);
            const category = categoryResponse.data;

            const quantity = 1;
            const total = product.price * quantity;

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
            setCartItems((prevCartItems) => [...prevCartItems, cartItem]);

            // Remove item from wishlist after adding to cart
            await removeFromWishlist(product.id);

            setSnackbarMessage("Item added to cart");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const addAllToCart = async () => {
        if (!loggedInUser) {
            alert("Please log in to add items to the cart.");
            return;
        }

        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

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

            const addItemsRequests = wishlistItems.map(async (item) => {
                const subcategoryResponse = await axios.get(`${apiBaseUrl}/api/SubCategories/${item.product.sub_categories_id}`);
                const subCategory = subcategoryResponse.data;
                const categoryResponse = await axios.get(`${apiBaseUrl}/api/Category/${subCategory.category_id}`);
                const category = categoryResponse.data;

                const quantity = 1;
                const total = item.product.price * quantity;

                const cartItem = {
                    cart_id: currentCartId,
                    product_id: item.product.id,
                    quantity: quantity,
                    total: total,
                    Product: {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        image_url: item.product.image_url,
                        sub_categories_id: item.product.sub_categories_id,
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
                return cartItem;
            });

            const newCartItems = await Promise.all(addItemsRequests);
            setCartItems((prevCartItems) => [...prevCartItems, ...newCartItems]);
            setWishlistItems([]);

            setSnackbarMessage("All items added to cart");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error adding all items to cart:", error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Item</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Remove</p>
                    <p>Add to Cart</p>
                </div>
                <br />
                <hr />
                {wishlistItems.map((item) => (
                    <div key={item.id}>
                        <div className="cart-items-title cart-items-item">
                            <img src={item.product.image_url} alt={item.product.name} />
                            <p>{item.product.name}</p>
                            <p>${item.product.price}</p>
                            <Box display="flex" alignItems="center">
                                <IconButton onClick={() => removeFromWishlist(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                            <IconButton onClick={() => addToCart(item.product)}>
                                <AddIcon />
                            </IconButton>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>

            <div className="add-all">
                <Button onClick={addAllToCart}>Add All to Cart</Button>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
