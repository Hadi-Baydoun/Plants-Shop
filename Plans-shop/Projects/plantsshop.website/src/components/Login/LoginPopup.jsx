import "./LoginPopup.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import cross_icon from "../../assets/pictures/cross_icon.png";
import { Snackbar, Alert } from '@mui/material';

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

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

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
            setSnackbarMessage("Account created successfully! Please enter your address.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error during customer creation:", error);
            setSnackbarMessage("Customer creation failed. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
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
                Customer_id: customerId, 
                Customer: {
                    first_Name: formData.firstName,
                    last_Name: formData.lastName,
                    phone_Number: formData.phoneNumber,
                    email: formData.email,
                    password: formData.password
                }
            };

          

            await axios.post(`${apiBaseUrl}/api/Address/add`, payload);

            // Set the logged in user state
            setLoggedInUser({
                first_Name: formData.firstName,
                last_Name: formData.lastName,
                phone_Number: formData.phoneNumber,
                email: formData.email,
            });

            setSnackbarMessage("Address added successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setShowLogin(false);
        } catch (error) {
            console.error("Error during address creation:", error);
            setSnackbarMessage("Address creation failed. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
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
                setSnackbarMessage('Login Successful!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                console.log('Snackbar set to open (success): ', true);
            } else {
                setSnackbarMessage("Login failed. Please check your credentials and try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                console.log('Snackbar set to open (error): ', true);
            }
        } catch (error) {
            console.error("Error during login:", error);
            setSnackbarMessage("Login failed. Please check your credentials and try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            console.log('Snackbar set to open (error): ', true);
        }
    };

    useEffect(() => {
        if (snackbarOpen && snackbarSeverity === 'success') {
            const timer = setTimeout(() => {
                setShowLogin(false);
            }, 2000); 
            return () => clearTimeout(timer);
        }
    }, [snackbarOpen, snackbarSeverity]);




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
                    <h2>{loggedInUser ? `Welcome` : currState}</h2>
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
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </motion.form>
            
        </div>
    );

};

export default LoginPopup;
