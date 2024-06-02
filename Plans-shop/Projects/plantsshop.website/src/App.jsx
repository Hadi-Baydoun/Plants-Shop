import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Shop from './pages/Shop';
import { useState } from 'react';
import LoginPopup from './components/Login/LoginPopup';
import Cart from './components/Cart/CartSection/Cart';
import { OrderPage } from './components/Cart/OrderPageSection/OrderPage';

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [customerId, setCustomerId] = useState(null);

    return (
        <Router>
            <div className='app'>
                {showLogin && (
                    <LoginPopup
                        setShowLogin={setShowLogin}
                        loggedInUser={loggedInUser}
                        setLoggedInUser={setLoggedInUser}
                    />
                )}
                <NavBar
                    setShowLogin={setShowLogin}
                    loggedInUser={loggedInUser}
                    setCartId={setCartId}
                />
                <Routes>
                    <Route path="/" element={<Home loggedInUser={loggedInUser} cartId={cartId} setCartId={setCartId} />} />
                    <Route path="/shop" element={<Shop loggedInUser={loggedInUser} cartId={cartId} setCartId={setCartId} />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart loggedInUser={loggedInUser} setCartId={setCartId} setCustomerId={setCustomerId} />} />
                    <Route path="/order" element={<OrderPage loggedInUser={loggedInUser} cartId={cartId} customerId={customerId} />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
