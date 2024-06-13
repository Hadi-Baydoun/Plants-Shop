import "./LoginPopup.css";
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import cross_icon from "../../assets/pictures/cross_icon.png";
import { Snackbar, Alert } from '@mui/material';
import axios from "axios";
import { AuthContext } from '../../context/AuthContext';

const LoginPopup = ({ setShowLogin, loggedInUser, setLoggedInUser }) => {
    const { user, login, logout } = useContext(AuthContext);
    const [currState, setCurrState] = useState("Sign Up"); // State for current form state (Login/Sign Up)
    const [showAddressForm, setShowAddressForm] = useState(false); // State to show/hide address form
    const [customerId, setCustomerId] = useState(null); // State for customer ID
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

    // Handle form field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;
        const result = await login(email, password); // Call login function from AuthContext
        if (result.success) {
            setSnackbarMessage('Login Successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage(result.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    // Handle customer registration form submission
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

            if (customerResponse.status === 200) {
                setSnackbarMessage('Account created successfully! Please login.');
                setSnackbarSeverity('success');
                setCurrState("Login"); // Switch to login form after successful registration
            } else {
                setSnackbarMessage('Failed to create account. Please try again.');
                setSnackbarSeverity('error');
            }
        } catch (error) {
            setSnackbarMessage('Failed to create account. Please try again.');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    };

    // Handle address form submission
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
            setSnackbarMessage("Address creation failed. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    // Close the login popup after showing a success message
    useEffect(() => {
        if (snackbarOpen && snackbarSeverity === 'success') {
            const timer = setTimeout(() => {
                setShowLogin(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [snackbarOpen, snackbarSeverity]);

    const handleSignOut = () => {
        logout();  // Call logout function from AuthContext
        setCurrState("Sign Up");  // Switch to sign up form
        setShowAddressForm(false);  // Hide address form
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
                onSubmit={currState === "Login" ? handleLoginSubmit : handleCustomerSubmit}
            >
                <div className="login-popup-title">
                    <h2>{user ? `Welcome` : currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={cross_icon} alt="close" />
                </div>
                {user ? (
                    <div className="logged-in-content">
                        <p>{`Hello, ${user.first_Name}`}</p>
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
