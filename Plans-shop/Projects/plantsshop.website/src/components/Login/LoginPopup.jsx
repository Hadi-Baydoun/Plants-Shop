import "./LoginPopup.css";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import cross_icon from "../../assets/cross_icon.png";

const LoginPopup = ({ setShowLogin, loggedInUser, setLoggedInUser }) => {
    const [currState, setCurrState] = useState("Sign Up");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("/src/assets/Constants.json");
            const apiBaseUrl = response.data.API_HOST;

            if (currState === "Sign Up") {
                await axios.post(`${apiBaseUrl}/api/Customer/add`, {
                    first_Name: formData.firstName,
                    last_Name: formData.lastName,
                    phone_Number: formData.phoneNumber,
                    email: formData.email,
                    password: formData.password,
                });
                alert("Account created successfully!");
            } else {
                const customersResponse = await axios.get(`${apiBaseUrl}/api/Customer/all`);
                const customer = customersResponse.data.find(customer => customer.email === formData.email && customer.password === formData.password);
                if (customer) {
                    setLoggedInUser(customer);
                    alert("Login successful!");
                } else {
                    alert("Invalid email or password.");
                }
            }
            setShowLogin(false);
        } catch (error) {
            console.error("Error during authentication:", error);
            alert("Authentication failed. Please try again.");
        }
    };

    const handleSignOut = () => {
        setLoggedInUser(null);
        setCurrState("Sign Up");
    };

    useEffect(() => {
        const form = document.querySelector('.login-popup-container');
        form.addEventListener('submit', handleSubmit);
        return () => form.removeEventListener('submit', handleSubmit);
    }, [currState, formData, setShowLogin]);

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
                    <h2>{loggedInUser ? "Welcome" : currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={cross_icon} alt="close" />
                </div>
                {loggedInUser ? (
                    <div className="logged-in-content">
                        <p>{`Hello, ${loggedInUser.first_Name}`}</p>
                        <button type="button" onClick={handleSignOut}>Sign Out</button>
                    </div>
                ) : (
                    <>
                        <div className="login-popup-inputs">
                            {currState === "Sign Up" && (
                                <>
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
                                </>
                            )}
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
                        <button type="submit">
                            {currState === "Sign Up" ? "Create Account" : "Login"}
                        </button>
                        <div className="login-popup-condition">
                            <input type="checkbox" required />
                            <p>By Continuing, I agree to the terms of use & privacy policy.</p>
                        </div>
                        {currState === "Login" ? (
                            <p>
                                Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
                            </p>
                        ) : (
                            <p>
                                Already have an account? <span onClick={() => setCurrState("Login")}>Login Here</span>
                            </p>
                        )}
                    </>
                )}
            </motion.form>
        </div>
    );
};

export default LoginPopup;
