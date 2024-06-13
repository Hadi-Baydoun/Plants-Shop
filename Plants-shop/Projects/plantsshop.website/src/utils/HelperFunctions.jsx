import axios from 'axios';

export const handleCartToggle = async (product, user, cart, cartId, setCart, setCartId, setSnackbarMessage, setSnackbarSeverity, bulk= false) => {
    if (!user) {
        alert("Please log in to add items to the cart.");
        return;
    }

    try {
        const response = await axios.get("/src/assets/Constants.json");
        const apiBaseUrl = response.data.API_HOST;

        const existingCartItem = cart.find((item) => item.product_id === product.id);

        if (existingCartItem) {
            await axios.delete(`${apiBaseUrl}/api/CartItem/delete/${existingCartItem.id}`);
            setCart((prevCart) => prevCart.filter((item) => item.id !== existingCartItem.id));
            setSnackbarMessage("Item removed from cart");
            setSnackbarSeverity("warning");
        } else {
            let currentCartId = cartId;
            if (!currentCartId) {
                const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
                currentCartId = cartResponse.data.id;
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
                const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
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
                if (setWishlistId) {
                    setWishlistId(currentWishlistId);
                }
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

export const fetchCartItems = async (user, setCart, setCartId) => {
    if (user) {
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            // Fetch or create cart by customer ID
            const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
            const currentCartId = cartResponse.data.id;

            // Fetch cart items by cart ID
            const cartItemsResponse = await axios.get(`${apiBaseUrl}/api/CartItem/getByCartId/${currentCartId}`);
            setCart(cartItemsResponse.data);

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
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            // Fetch or create wishlist by customer ID
            const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
            const currentWishlistId = wishlistResponse.data.id;

            // Fetch wishlist items by wishlist ID
            const wishlistItemsResponse = await axios.get(`${apiBaseUrl}/api/WishlistItems/getByWishlistId/${currentWishlistId}`);
            setWishlist(wishlistItemsResponse.data);

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


