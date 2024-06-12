import "../../Home.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Pagination,
    Collapse,
    Snackbar,
    Alert
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ".././HomePage/ArrivalsSection/Arrivals.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 9;

export default function Shop() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [openCategories, setOpenCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const navigate = useNavigate();
    const { user, cartId, setCartId, wishlistId, setWishlistId, cart, setCart, wishlist, setWishlist } = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;
                const productsResponse = await axios.get(`${apiBaseUrl}/api/Products/all`);
                setItems(productsResponse.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;
                const subCategoriesResponse = await axios.get(`${apiBaseUrl}/api/SubCategories/all`);
                const groupedCategories = groupCategories(subCategoriesResponse.data);
                setCategories(groupedCategories);
                setOpenCategories(Array(groupedCategories.length).fill(false));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const groupCategories = (subcategories) => {
            const categoryMap = {};
            subcategories.forEach((subcategory) => {
                const categoryName = subcategory.category.name;
                if (!categoryMap[categoryName]) {
                    categoryMap[categoryName] = [];
                }
                categoryMap[categoryName].push(subcategory);
            });
            return Object.keys(categoryMap).map((categoryName) => ({
                name: categoryName,
                subcategories: categoryMap[categoryName],
            }));
        };

        fetchProducts();
        fetchCategories();
    }, []);

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

        if (user) {
            fetchCartItems();
            fetchWishlistItems();
        }
    }, [user, setCartId, setWishlistId, setCart, setWishlist]);

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
                setSnackbarMessage("Item removed from wishlist");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
            } else {
                // If the product is not in the wishlist, add it
                let currentWishlistId = wishlistId;
                if (!currentWishlistId) {
                    const wishlistResponse = await axios.get(`${apiBaseUrl}/api/Wishlist/getOrCreateWishlistByCustomerId/${user.id}`);
                    currentWishlistId = wishlistResponse.data.id;
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
                setSnackbarMessage("Item added to wishlist");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error adding/removing item to/from wishlist:", error);
        }
    };

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
                setSnackbarMessage("Item removed from cart");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
            } else {
                // If the product is not in the cart, add it
                let currentCartId = cartId;
                if (!currentCartId) {
                    const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/getOrCreateCartByCustomerId/${user.id}`);
                    currentCartId = cartResponse.data.id;
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
                setSnackbarMessage("Item added to cart");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error adding/removing item to/from cart:", error);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleCategoryClick = (index) => {
        const newOpenCategories = [...openCategories];
        newOpenCategories[index] = !newOpenCategories[index];
        setOpenCategories(newOpenCategories);
    };

    const handleItemClick = (product) => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    const handleSubcategoryClick = (subcategoryId) => {
        setSelectedSubcategory((prevSelectedSubcategory) => {
            if (prevSelectedSubcategory === subcategoryId) {
                return null;
            } else {
                return subcategoryId;
            }
        });
        setPage(1); // Reset to page 1 when a subcategory is selected
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const filteredItems = items.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (selectedSubcategory === null || item.sub_categories_id === selectedSubcategory)
        );
    });

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const displayedItems = filteredItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    return (
        <div className="shop-container">
            <motion.div className="shop-sidebar">
                <Typography variant="h6" gutterBottom>
                    Custom Category
                </Typography>
                <Divider />
                <List>
                    {categories.map((category, index) => (
                        <div key={category.name}>
                            <ListItem button onClick={() => handleCategoryClick(index)}>
                                <ListItemText primary={category.name} />
                                {openCategories[index] ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={openCategories[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {category.subcategories?.map((subcategory) => (
                                        <ListItem
                                            button
                                            key={subcategory.id}
                                            sx={{ pl: 4 }}
                                            selected={selectedSubcategory === subcategory.id}
                                            onClick={() => handleSubcategoryClick(subcategory.id)}
                                        >
                                            <ListItemText primary={subcategory.name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    ))}
                </List>
            </motion.div>
            <div className="shop-content">
                <Typography variant="h4" gutterBottom className="shop-section-title">
                    Shop Section
                </Typography>
                <div className="shop-search">
                    <TextField
                        label="Search"
                        variant="outlined"
                        margin="normal"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="shop-search-bar"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                <div className="shop-section">
                    {displayedItems.map((item) => (
                        <div key={item.id} className="new-arrivals-product new-shop" onClick={() => handleItemClick(item)}>
                            <div className="product-image">
                                <img src={item.image_url} alt={`Product ${item.id}`} />
                            </div>
                            <div className="product-info">
                                <Typography className="product-name">{item.name}</Typography>
                                <div className="product-prices">
                                    <Typography className="current-price">
                                        ${item.price}
                                    </Typography>
                                </div>
                                <div className="product-icons">
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(item); }}>
                                        {wishlist.some((wishlistItem) => wishlistItem.product_id === item.id) ? (
                                            <FavoriteOutlinedIcon />
                                        ) : (
                                            <FavoriteBorderOutlinedIcon />
                                        )}
                                    </IconButton>
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleCartToggle(item); }}>
                                        {cart.some((cartItem) => cartItem.product_id === item.id) ? (
                                            <ShoppingCartOutlinedIcon />
                                        ) : (
                                            <AddShoppingCartOutlinedIcon />
                                        )}
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
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
