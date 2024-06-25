import axios from 'axios';
import { API_HOST } from '../assets/constants';

export const handleCartToggle = async (product, user, cart, cartId, setCart, setCartId, setSnackbarMessage, setSnackbarSeverity, bulk= false) => {
    if (!user) {
        alert("Please log in to add items to the cart.");
        return;
    }

    try {

        const existingCartItem = cart.find((item) => item.product_id === product.id);

        if (existingCartItem) {
            await axios.delete(`${API_HOST}/api/CartItem/delete/${existingCartItem.id}`);
            setCart((prevCart) => prevCart.filter((item) => item.id !== existingCartItem.id));
            setSnackbarMessage("Item removed from cart");
            setSnackbarSeverity("warning");
        } else {
            let currentCartId = cartId;
            if (!currentCartId) {
                const cartResponse = await axios.get(`${API_HOST}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
                currentCartId = cartResponse.data.id;
                setCartId(currentCartId);
            }
            

            const quantity = 1;
            const total = product.price * quantity;

            const cartItem = {
                cart_id: currentCartId,
                product_id: product.id,
                quantity: quantity,
                total: total,
            };

            await axios.post(`${API_HOST}/api/CartItem/add`, cartItem);
            setCart((prevCart) => [...prevCart, cartItem]);

            setSnackbarMessage("Item added to cart");
            setSnackbarSeverity("success");
        }
        if (bulk) {
            setSnackbarMessage("");
            setSnackbarSeverity("");
        }
    } catch (error) {
        console.error("Error adding/removing item to/from cart:", error);
    }
};

export const handleFavoriteToggle = async (product, user, wishlist, wishlistId, setWishlist, setWishlistId, setSnackbar) => {
    if (!user) {
        alert("Please log in to add items to the wishlist.");
        return;
    }

    try {

        // Check if the product is already in the wishlist
        const existingWishlistItem = wishlist.find((item) => item.product_id === product.id);

        if (existingWishlistItem) {
            // If the product is in the wishlist, remove it
            await axios.delete(`${API_HOST}/api/WishlistItems/delete/${existingWishlistItem.id}`);
            setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== existingWishlistItem.id));

            // Show snackbar for item removed
            setSnackbar({ open: true, message: "Item removed from wishlist", severity: "warning" });
        } else {
            // If the product is not in the wishlist, add it
            let currentWishlistId = wishlistId;
            if (!currentWishlistId) {
                const wishlistResponse = await axios.get(`${API_HOST}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
                if (wishlistResponse.data && wishlistResponse.data.id) {
                    currentWishlistId = wishlistResponse.data.id;
                } else {
                    const newWishlistResponse = await axios.post(`${API_HOST}/api/Wishlist/add`, {
                        Customer_id: user.id,

                    });
                    currentWishlistId = newWishlistResponse.data.id;
                }
                if (setWishlistId) {
                    setWishlistId(currentWishlistId);
                }
            }


            // Add item to wishlist with all necessary details
            const wishlistItem = {
                wishlist_id: currentWishlistId,
                product_id: product.id,
                
            };

            await axios.post(`${API_HOST}/api/WishlistItems/add`, wishlistItem);
            setWishlist((prevWishlist) => [...prevWishlist, wishlistItem]);

            // Show snackbar for item added
            setSnackbar({ open: true, message: "Item added to wishlist", severity: "success" });
        }
    } catch (error) {
        console.error("Error adding/removing item to/from wishlist:", error);
    }
};

export const fetchCartItems = async (user, setCart, setCartId) => {
    if (user) {
        try {


            // Fetch or create cart by customer ID
            const cartResponse = await axios.get(`${API_HOST}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
            const currentCartId = cartResponse.data.id;

            // Fetch cart items by cart ID
            const cartItemsResponse = await axios.get(`${API_HOST}/api/CartItem/getByCartId/${currentCartId}`);


            const cartItemsWithDetails = await Promise.all(cartItemsResponse.data.map(async (item) => {
                const productDetailsResponse = await axios.get(`${API_HOST}/api/Products/details/${item.product_id}`);
                const productDetails = productDetailsResponse.data;

                return {
                    ...item,
                    product: productDetails
                };
            }));

            setCart(cartItemsWithDetails);



            // Set cart ID for future use
            if (setCartId) {
                setCartId(currentCartId);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }
};

export const fetchWishlistItems = async (user, setWishlist, setWishlistId) => {
    if (user) {
        try {

            // Fetch or create wishlist by customer ID
            const wishlistResponse = await axios.get(`${API_HOST}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
            const currentWishlistId = wishlistResponse.data.id;
         
            // Fetch wishlist items by wishlist ID
            const wishlistItemsResponse = await axios.get(`${API_HOST}/api/WishlistItems/getByWishlistId/${currentWishlistId}`);
            const wishlistItemWithDetails = await Promise.all(wishlistItemsResponse.data.map(async (item) => {
                const productDetailsResponse = await axios.get(`${API_HOST}/api/Products/details/${item.product_id}`);
                const productDetails = productDetailsResponse.data;
                return {
                    ...item,
                    product: productDetails
                };
            }));
            setWishlist(wishlistItemWithDetails);

            // Set wishlist ID for future use
            if (setWishlistId) {
                setWishlistId(currentWishlistId);
            }
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        }
    }
};

export const handleCloseSnackbar = (setSnackbar) => () => {
    setSnackbar({ open: false, message: "", severity: "success" });
};


