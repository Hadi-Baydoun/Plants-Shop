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
import { handleCartToggle, handleFavoriteToggle, fetchCartItems, fetchWishlistItems, handleCloseSnackbar } from '../../utils/HelperFunctions';
import { API_HOST } from '../../assets/constants';

const ITEMS_PER_PAGE = 9;

export default function Shop() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [openCategories, setOpenCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const navigate = useNavigate();
    const { user, cartId, setCartId, wishlistId, setWishlistId, cart, setCart, wishlist, setWishlist } = useContext(AuthContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsResponse = await axios.get(`${API_HOST}/api/Products/all`);
                setItems(productsResponse.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        const fetchCategories = async () => {
            try {
                const subCategoriesResponse = await axios.get(`${API_HOST}/api/SubCategories/all`);
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
        fetchCartItems(user, setCart, setCartId);
        fetchWishlistItems(user, setWishlist, setWishlistId);
    }, [user, setCartId, setCart, setWishlistId, setWishlist]);

    const handleAddToCartToggle = (product) => {
        handleCartToggle(
            product,
            user,
            cart,
            cartId,
            setCart,
            setCartId,
            (snackbarMessage) => setSnackbar((prevState) => ({ ...prevState, open: true, message: snackbarMessage })),
            (snackbarSeverity) => setSnackbar((prevState) => ({ ...prevState, open: true, severity: snackbarSeverity }))
        );
    };

    const handleAddToWishlistToggle = (product) => {
        handleFavoriteToggle(
            product,
            user,
            wishlist,
            wishlistId,
            setWishlist,
            setWishlistId,
            (snackbarState) => setSnackbar((prevState) => ({ ...prevState, ...snackbarState }))
        );
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
        setSnackbar({ open: false, message: "", severity: "success" });
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
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleAddToWishlistToggle(item); }}>
                                        {wishlist.some((wishlistItem) => wishlistItem.product_id === item.id) ? (
                                            <FavoriteOutlinedIcon />
                                        ) : (
                                            <FavoriteBorderOutlinedIcon />
                                        )}
                                    </IconButton>
                                    <IconButton onClick={(e) => { e.stopPropagation(); handleAddToCartToggle(item); }}>
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
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar(setSnackbar)}
            >
                <Alert onClose={handleCloseSnackbar(setSnackbar)} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
}