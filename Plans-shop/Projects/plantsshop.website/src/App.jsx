import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/HomePage/Home';
import Contact from './pages/ContactPage/Contact';
import AboutUs from './pages/AboutUsPage/AboutUs';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Shop from './pages/Shop';
import { useState } from 'react';
import LoginPopup from './components/Login/LoginPopup';
import Cart from './pages/CartPage/Cart';
import { OrderPage } from './pages/OrderPage/OrderPage';
import Wishlist from './pages/WishlistPage/wishlist';

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const [wishlistId, setWishlistId] = useState(null);

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
                    setWishlistId={setWishlistId} 
                />
                <Routes>
                    <Route path="/" element={<Home loggedInUser={loggedInUser} cartId={cartId} setCartId={setCartId} />} />
                    <Route path="/shop" element={<Shop loggedInUser={loggedInUser} cartId={cartId} setCartId={setCartId} />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart loggedInUser={loggedInUser} setCartId={setCartId} setCustomerId={setCustomerId} />} />
                    <Route path="/order" element={<OrderPage loggedInUser={loggedInUser} cartId={cartId} customerId={customerId} />} />
                     <Route path="/wishlist" element={<Wishlist loggedInUser={loggedInUser} setWishlistId={setWishlistId} setCustomerId={setCustomerId} cartId={cartId} setCartId={setCartId} />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
