import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Cart.css";
import {
    ButtonGroup,
    IconButton,
    Typography,
    Box
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from '../../context/AuthContext';
import { fetchCartItems} from '../../utils/HelperFunctions';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const { user, cartId, setCartId } = useContext(AuthContext);


    //maybe it will give an issue later ( setCartItems and not setCart)
    useEffect(() => {
        if (user) {
            fetchCartItems(user, setCartItems, setCartId);
        }
    }, [user, setCartId]);

    const removeFromCart = async (id) => {
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            await axios.delete(`${apiBaseUrl}/api/CartItem/delete/${id}`);
            setCartItems(cartItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            const updatedItem = cartItems.find(item => item.id === id);
            updatedItem.quantity = newQuantity;
            updatedItem.total = updatedItem.product.price * newQuantity;

            await axios.put(`${apiBaseUrl}/api/CartItem/update`, updatedItem);
            setCartItems(cartItems.map(item => item.id === id ? updatedItem : item));
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((acc, item) => acc + item.total, 0).toFixed(2);
    };

    const handleProceedToCheckout = () => {
        navigate('/order');
    };

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Item</p>
                    <p>Title</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {cartItems.map((item) => {
                    console.log("Cart item details:", JSON.stringify(item, null, 2));
                    return (
                        <div key={item.id}>
                            <div className="cart-items-title cart-items-item">
                                <img src={item.product.image_url} alt={item.product.name} />
                                <p>{item.product.name}</p>
                                <p>${item.product.price.toFixed(2)}</p>
                                <Box display="flex" alignItems="center">
                                    <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                        <RemoveIcon />
                                    </IconButton>
                                    <Typography style={{ margin: "0 10px" }}>{item.quantity}</Typography>
                                    <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                                <p>${item.total.toFixed(2)}</p>
                                <IconButton onClick={() => removeFromCart(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                            <hr />
                        </div>
                    );
                })}
            </div>

            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${calculateSubtotal()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${calculateSubtotal()}</b>
                        </div>
                    </div>
                    <button onClick={handleProceedToCheckout}>Proceed To Checkout</button>
                </div>
            </div>
            <hr />
        </div>
    );
}
