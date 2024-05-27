import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Cart.css";

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;

                const cartItemsResponse = await axios.get(`${apiBaseUrl}/api/CartItem/all`);
                setCartItems(cartItemsResponse.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

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
                {cartItems.map((item) => (
                    <div key={item.id}>
                        <div className="cart-items-title cart-items-item">
                            <img src={item.product.image_url} alt={item.product.name} /> 
                            <p>{item.product.name}</p>
                            <p>${item.product.price.toFixed(2)}</p>
                            <p>{item.quantity}</p>
                            <p>${item.total.toFixed(2)}</p>
                            <p className="cross" onClick={() => removeFromCart(item.id)}>x</p>
                        </div>
                        <hr />
                    </div>
                ))}
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
