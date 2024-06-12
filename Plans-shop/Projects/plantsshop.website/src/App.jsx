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
import Shop from './pages/ShopPage/Shop';
import { useState } from 'react';
import LoginPopup from './components/Login/LoginPopup';
import Cart from './pages/CartPage/Cart';
import { OrderPage } from './pages/OrderPage/OrderPage';
import Wishlist from './pages/WishlistPage/wishlist';
import ProductDescription from './pages/ShopPage/ProductDescription/ProductDescription';
import { AuthProvider } from './context/AuthContext';

function App() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <div className='app'>
                    {showLogin && (
                        <LoginPopup
                            setShowLogin={setShowLogin}
                        />
                    )}
                    <NavBar
                        setShowLogin={setShowLogin}
                    />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/product/:id" element={<ProductDescription />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/order" element={<OrderPage />} />
                        <Route path="/wishlist" element={<Wishlist />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
