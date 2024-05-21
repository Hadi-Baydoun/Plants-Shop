import "../Home.css";
import reasonPlant from "../assets/reasonPlant.jpeg";
import { useState } from "react";
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
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import "./HomeComponents/Arrivals.css";

const items = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  name: `Test Item ${i + 1}`,
  description: `Description Test ${i + 1}`,
  price: 20,
  image: reasonPlant,
}));

const categories = [
  {
    name: "Bed & Bath",
    subcategories: ["Bedding", "Bathroom Accessories"],
  },
  {
    name: "Vegetable",
    subcategories: ["Leafy Greens", "Root Vegetables"],
  },
  {
    name: "Brassica rapa",
    subcategories: ["Turnip", "Bok Choy"],
  },
  {
    name: "Freeze drying",
    subcategories: ["Fruits", "Vegetables"],
  },
  {
    name: "Instant coffee",
    subcategories: ["Regular", "Decaf"],
  },
  {
    name: "Bouillon cube",
    subcategories: ["Chicken", "Beef"],
  },
];

const ITEMS_PER_PAGE = 9;

export default function Shop() {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openCategories, setOpenCategories] = useState(
    Array(categories.length).fill(false)
  );

  const handleFavoriteToggle = (id) => {
    setFavoriteItems((prevFavoriteItems) => {
      if (prevFavoriteItems.includes(id)) {
        return prevFavoriteItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevFavoriteItems, id];
      }
    });
  };

  const handleCartToggle = (id) => {
    setCartItems((prevCartItems) => {
      if (prevCartItems.includes(id)) {
        return prevCartItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevCartItems, id];
      }
    });
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

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div key={index}>
              <ListItem button onClick={() => handleCategoryClick(index)}>
                <ListItemText primary={category.name} />
                {openCategories[index] ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openCategories[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {category.subcategories.map((subcategory, subIndex) => (
                    <ListItem button key={subIndex} sx={{ pl: 4 }}>
                      <ListItemText primary={subcategory} />
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
            <div key={item.id} className="new-arrivals-product new-shop">
              <div className="product-image">
                <img src={item.image} alt={`Product ${item.id}`} />
              </div>
              <div className="product-info">
                <Typography className="product-name">{item.name}</Typography>
                <div className="product-prices">
                  <Typography className="current-price">
                    ${item.price}
                  </Typography>
                </div>
                <div className="product-icons">
                  <IconButton onClick={() => handleFavoriteToggle(item.id)}>
                    {favoriteItems.includes(item.id) ? (
                      <FavoriteOutlinedIcon />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </IconButton>
                  <IconButton onClick={() => handleCartToggle(item.id)}>
                    {cartItems.includes(item.id) ? (
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
    </div>
  );
}
