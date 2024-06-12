import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // Initialize state variables for user, token, token expiry, cart, and wishlist
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [tokenExpiry, setTokenExpiry] = useState(localStorage.getItem('tokenExpiry') || 0);
    const [cartId, setCartId] = useState(null);
    const [wishlistId, setWishlistId] = useState(null);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Function to handle login
    const login = async (email, password) => {
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;
            const loginResponse = await axios.post(`${apiBaseUrl}/api/Customer/login`, { email, password });
            const { token, customer } = loginResponse.data;
            customer.password = password;
            setUser(customer); // Set the user object with the customer data
            setToken(token);
            const expiryTime = Date.now() + 1 * 60 * 1000; // Set token expiry to 1 minute from now
            setTokenExpiry(expiryTime); // Set the token expiry time
            localStorage.setItem('user', JSON.stringify(customer));
            localStorage.setItem('token', token);
            localStorage.setItem('tokenExpiry', expiryTime);
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Login failed. Please check your credentials and try again.' };
        }
    };

    // Function to handle logout
    const logout = () => {
        setUser(null);  // Clear the user state
        setToken('');  // Clear the token
        setTokenExpiry(0);  // Clear the token expiry time
        setCartId(null);  // Clear the cart ID
        setWishlistId(null);  // Clear the wishlist ID
        setCart([]);  // Clear the cart
        setWishlist([]);  // Clear the wishlist
        localStorage.removeItem('user');  
        localStorage.removeItem('token');  
        localStorage.removeItem('tokenExpiry');  
    };

    // check token expiry and logout if expired

    useEffect(() => {
        if (token) {
            const expiryTime = localStorage.getItem('tokenExpiry');
            if (Date.now() > expiryTime) {
                logout();
            }
        }
    }, [token]);

    // fetch cart and wishlist data when the user state changes
    useEffect(() => {
        if (user) {
            const fetchCartAndWishlist = async () => {
                try {
                    const response = await axios.get("/src/assets/Constants.json");
                    const apiBaseUrl = response.data.API_HOST;

                    const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
                    setCartId(cartResponse.data.id);
                    const cartItemsResponse = await axios.get(`${apiBaseUrl}/api/CartItem/getByCartId/${cartResponse.data.id}`);
                    setCart(cartItemsResponse.data);

                    const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
                    setWishlistId(wishlistResponse.data.id);
                    const wishlistItemsResponse = await axios.get(`${apiBaseUrl}/api/WishlistItems/getByWishlistId/${wishlistResponse.data.id}`);
                    setWishlist(wishlistItemsResponse.data);
                } catch (error) {
                    console.error("Error fetching cart and wishlist:", error);
                }
            };

            fetchCartAndWishlist();
        }
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,             // The current authenticated user object
                token,            // The authentication token for the user
                login,            // The function to log in a user
                logout,           // The function to log out a user
                cartId,           // The ID of the user's cart
                wishlistId,       // The ID of the user's wishlist
                setCartId,        // Function to set the cart ID
                setWishlistId,    // Function to set the wishlist ID
                cart,             // The array of items in the user's cart
                setCart,          // Function to set the cart items
                wishlist,         // The array of items in the user's wishlist
                setWishlist       // Function to set the wishlist items
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
