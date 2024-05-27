import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderPage.css";

export const OrderPage = () => {
    const [customer, setCustomer] = useState(null);
    const [address, setAddress] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const fetchCustomerAndAddress = async () => {
            try {
                const response = await axios.get("/src/assets/Constants.json");
                const apiBaseUrl = response.data.API_HOST;

                // Fetch cart items to get the cart_id
                const cartItemsResponse = await axios.get(`${apiBaseUrl}/api/CartItem/all`);
                if (cartItemsResponse.data.length === 0) {
                    console.error("No cart items found.");
                    return;
                }

                setCartItems(cartItemsResponse.data);

                const cartId = cartItemsResponse.data[0].cart_id;

                // Fetch cart to get the customer_id
                const cartResponse = await axios.get(`${apiBaseUrl}/api/Cart/${cartId}`);
                const customerId = cartResponse.data.customer_id;

                // Fetch customer data
                const customerResponse = await axios.get(`${apiBaseUrl}/api/Customer/${customerId}`);
                setCustomer(customerResponse.data);

                // Fetch address data
                const addressResponse = await axios.get(`${apiBaseUrl}/api/Address/all`);
                const customerAddress = addressResponse.data.find(address => address.customer_id === customerId);
                setAddress(customerAddress);

                // Calculate subtotal
                const subtotal = cartItemsResponse.data.reduce((acc, item) => acc + item.total, 0);
                setSubtotal(subtotal);
            } catch (error) {
                console.error('Error fetching customer and address data:', error);
            }
        };

        fetchCustomerAndAddress();
    }, []);

    if (!customer || !address) {
        return <div>Loading...</div>;
    }

    return (
        <form className="place-order">
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="field-group">
                    <label>First Name</label>
                    <input type="text" value={customer.first_Name} readOnly />
                </div>
                <div className="field-group">
                    <label>Last Name</label>
                    <input type="text" value={customer.last_Name} readOnly />
                </div>
                <div className="field-group">
                    <label>Address</label>
                    <input type="text" value={address.address} readOnly />
                </div>
                <div className="multi-fields-order">
                    <div className="field-group">
                        <label>City</label>
                        <input type="text" value={address.city} readOnly />
                    </div>
                    <div className="field-group">
                        <label>Region</label>
                        <input type="text" value={address.region} readOnly />
                    </div>
                </div>
                <div className="field-group">
                    <label>Postal Code</label>
                    <input type="text" value={address.postal_code} readOnly />
                </div>
                <div className="field-group">
                    <label>Phone Number</label>
                    <input type="text" value={customer.phone_Number} readOnly />
                </div>
            </div>

            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Total</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>${subtotal.toFixed(2)}</b>
                        </div>
                    </div>
                    <button>
                        Proceed To Payment
                    </button>
                </div>
            </div>
        </form>
    );
};
