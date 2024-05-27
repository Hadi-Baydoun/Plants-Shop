import "./LoginPopup.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import cross_icon from "../../assets/cross_icon.png";

const LoginPopup = ({ setShowLogin, loggedInUser, setLoggedInUser }) => {
    const [currState, setCurrState] = useState("Sign Up");
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [customerId, setCustomerId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        city: "",
        region: "",
        address: "",
        streetNumber: "",
        postalCode: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCustomerSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            const customerResponse = await axios.post(`${apiBaseUrl}/api/Customer/add`, {
                first_Name: formData.firstName,
                last_Name: formData.lastName,
                phone_Number: formData.phoneNumber,
                email: formData.email,
                password: formData.password,
            });

            const newCustomerId = customerResponse.data.id;
            setCustomerId(newCustomerId);
            setShowAddressForm(true);
            alert("Account created successfully! Please enter your address.");
        } catch (error) {
            console.error("Error during customer creation:", error);
            alert("Customer creation failed. Please try again.");
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            const payload = {
                city: formData.city,
                region: formData.region,
                address: formData.address,
                street_number: formData.streetNumber,
                postal_code: formData.postalCode,
                Customer_id: customerId, // Ensure this is included and correctly spelled
                Customer: {
                    first_Name: formData.firstName,
                    last_Name: formData.lastName,
                    phone_Number: formData.phoneNumber,
                    email: formData.email,
                    password: formData.password
                }
            };

            console.log("Payload:", JSON.stringify(payload)); // Log payload for debugging

            await axios.post(`${apiBaseUrl}/api/Address/add`, payload);

            // Set the logged in user state
            setLoggedInUser({
                first_Name: formData.firstName,
                last_Name: formData.lastName,
                phone_Number: formData.phoneNumber,
                email: formData.email,
            });

            alert("Address added successfully!");
            setShowLogin(false);
        } catch (error) {
            console.error("Error during address creation:", error);
            alert("Address creation failed. Please try again.");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            const customersResponse = await axios.get(`${apiBaseUrl}/api/Customer/all`);
            const customers = customersResponse.data;

            const matchedCustomer = customers.find(customer =>
                customer.email === formData.email && customer.password === formData.password
            );

            if (matchedCustomer) {
                setLoggedInUser(matchedCustomer);
                alert(`Welcome back, ${matchedCustomer.first_Name}!`);
                setShowLogin(false);
            } else {
                alert("Login failed. Please check your credentials and try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please check your credentials and try again.");
        }
    };




    const handleSignOut = () => {
        setLoggedInUser(null);
        setCurrState("Sign Up");
        setShowAddressForm(false);
    };

    useEffect(() => {
        const form = document.querySelector('.login-popup-container');
        const submitHandler = showAddressForm ? handleAddressSubmit : currState === "Sign Up" ? handleCustomerSubmit : handleLoginSubmit;
        form.addEventListener('submit', submitHandler);
        return () => form.removeEventListener('submit', submitHandler);
    }, [showAddressForm, formData, setShowLogin, currState]);

    return (
        <div className="login-popup">
            <motion.form
                className="login-popup-container"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
            >
                <div className="login-popup-title">
                    <h2>{loggedInUser ? `Hello, ${loggedInUser.first_Name}` : currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={cross_icon} alt="close" />
                </div>
                {loggedInUser ? (
                    <div className="logged-in-content">
                        <p>{`Hello, ${loggedInUser.first_Name}`}</p>
                        <button type="button" onClick={handleSignOut}>Sign Out</button>
                    </div>
                ) : (
                    <>
                        {!showAddressForm && currState === "Sign Up" ? (
                            <div className="login-popup-inputs">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ) : !showAddressForm && currState === "Login" ? (
                            <div className="login-popup-inputs">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="login-popup-inputs">
                                <input
                                    type="text"
                                    placeholder="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Region"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Street Number"
                                    name="streetNumber"
                                    value={formData.streetNumber}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <button type="submit">
                            {showAddressForm ? "Add Address" : currState === "Sign Up" ? "Create Account" : "Login"}
                        </button>
                        {!showAddressForm && (
                            <div className="login-popup-condition">
                                <input type="checkbox" required />
                                <p>By Continuing, I agree to the terms of use & privacy policy.</p>
                            </div>
                        )}
                        {!showAddressForm && currState === "Login" ? (
                            <p>
                                Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
                            </p>
                        ) : (
                            !showAddressForm && (
                                <p>
                                    Already have an account? <span onClick={() => setCurrState("Login")}>Login Here</span>
                                </p>
                            )
                        )}
                    </>
                )}
            </motion.form>
        </div>
    );

};

export default LoginPopup;
