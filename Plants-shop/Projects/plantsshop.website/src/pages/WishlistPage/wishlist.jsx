import { useState, useEffect, useContext } from "react";
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
import { AuthContext } from '../../context/AuthContext';
import { fetchWishlistItems, handleCartToggle } from '../../utils/HelperFunctions';
import { API_HOST } from '../../assets/constants';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { user, wishlistId, setWishlistId, cartId, setCartId } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchWishlistItems(user, setWishlistItems, setWishlistId);
        }
    }, [user, setWishlistId]);

    const removeFromWishlist = async (wishlistItemId) => {
        try {


            // Delete the wishlist item using its ID
            await axios.delete(`${API_HOST}/api/WishlistItems/delete/${wishlistItemId}`);

            // Update the wishlist state by filtering out the removed item
            setWishlistItems((prevWishlistItems) => prevWishlistItems.filter(item => item.id !== wishlistItemId));
        } catch (error) {
            console.error(`Error removing item with ID ${wishlistItemId} from wishlist:`, error);
        }
    };



    const addToCart = async (product) => {
        if (!user) {
            alert("Please log in to add items to the cart.");
            return;
        }

        // Use handleCartToggle for adding to the cart
        await handleCartToggle(
            product,
            user,
            cartItems,
            cartId,
            setCartItems,
            setCartId,
            setSnackbarMessage,
            setSnackbarSeverity
        );

        // Remove item from wishlist after adding to cart
        const wishlistItem = wishlistItems.find(item => item.product.id === product.id);
        if (wishlistItem) {
            await removeFromWishlist(wishlistItem.id);
            setWishlistItems((prevWishlistItems) => prevWishlistItems.filter(item => item.product.id !== product.id));
        }

        setSnackbarOpen(true);
    };




    const addAllToCart = async () => {
        if (!user) {
            alert("Please log in to add items to the cart.");
            return;
        }

        try {

            let currentCartId = cartId;
            if (!currentCartId) {
                const cartResponse = await axios.get(`${API_HOST}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
                if (cartResponse.data && cartResponse.data.id) {
                    currentCartId = cartResponse.data.id;
                } else {
                    const newCartResponse = await axios.post(`${API_HOST}/api/Cart/add`, {
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

            const addItemsRequests = wishlistItems.map(async (item) => {
                await handleCartToggle(
                    item.product,
                    user,
                    cartItems,
                    currentCartId,
                    setCartItems,
                    setCartId,
                    setSnackbarMessage,
                    setSnackbarSeverity,
                    true
                );

                await removeFromWishlist(item.id);
                return item.product;
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
