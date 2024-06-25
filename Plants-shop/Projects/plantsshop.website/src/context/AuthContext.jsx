import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_HOST } from '../assets/constants';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // Initialize state variables for user, token, token expiry, cart, and wishlist
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
    const [tokenExpiry, setTokenExpiry] = useState(localStorage.getItem('tokenExpiry') || 0);
    const [refreshTokenExpiry, setRefreshTokenExpiry] = useState(Number(localStorage.getItem('refreshTokenExpiry')) || 0);
    const [cartId, setCartId] = useState(null);
    const [wishlistId, setWishlistId] = useState(null);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    // Function to handle login
    const login = async (email, password) => {
        try {
            const loginResponse = await axios.post(`${API_HOST}/api/Customer/login`, { email, password });
            const { token, customer, refreshToken, refreshTokenExpiry } = loginResponse.data;
            customer.password = password;
            setUser(customer); // Set the user object with the customer data
            setToken(token);
            setRefreshToken(refreshToken);
            const expiryTime = Date.now() + 60 * 60 * 1000; // Set token expiry to 60 minute from now
            const refreshExpiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
            setTokenExpiry(expiryTime); // Set the token expiry time
            localStorage.setItem('user', JSON.stringify(customer));
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('tokenExpiry', expiryTime);
            localStorage.setItem('refreshTokenExpiry', refreshExpiryTime);
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Login failed. Please check your credentials and try again.' };
        }
    };

    const refreshAccessToken = async () => {
        if (Date.now() > refreshTokenExpiry) {
            logout();
            return;
        }
        try {
            const refreshResponse = await axios.post(`${API_HOST }/api/Customer/refresh`, { token, refreshToken });
            const { token: newToken, refreshToken: newRefreshToken, refreshTokenExpiry: newRefreshTokenExpiry } = refreshResponse.data;
            setToken(newToken);
            setRefreshToken(newRefreshToken);
            const expiryTime = Date.now() + 15 * 60 * 1000; // Set token expiry to 15 minutes from now
            setTokenExpiry(expiryTime);
            setRefreshTokenExpiry(newRefreshTokenExpiry);
            localStorage.setItem('token', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            localStorage.setItem('tokenExpiry', expiryTime);
            localStorage.setItem('refreshTokenExpiry', newRefreshTokenExpiry);
        } catch (error) {
            logout();
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
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpiry');
    };

    const checkTokenExpiry = () => {
        if (token && Date.now() > tokenExpiry) {
            refreshAccessToken();
        }
    };

    useEffect(() => {
        checkTokenExpiry();
        const interval = setInterval(checkTokenExpiry, 1 * 60 * 1000); // Check token expiry every minute
        return () => clearInterval(interval);
    }, [token, tokenExpiry]);

    // fetch cart and wishlist data when the user state changes
    useEffect(() => {
        if (user) {
            const fetchCartAndWishlist = async () => {
                try {

                    const cartResponse = await axios.get(`${API_HOST }/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
                    setCartId(cartResponse.data.id);
                    const cartItemsResponse = await axios.get(`${API_HOST }/api/CartItem/getByCartId/${cartResponse.data.id}`);
                    setCart(cartItemsResponse.data);

                    const wishlistResponse = await axios.get(`${API_HOST }/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
                    setWishlistId(wishlistResponse.data.id);
                    const wishlistItemsResponse = await axios.get(`${API_HOST }/api/WishlistItems/getByWishlistId/${wishlistResponse.data.id}`);
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
                setWishlist,       // Function to set the wishlist items
                refreshAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
