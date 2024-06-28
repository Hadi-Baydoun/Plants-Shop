import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useState, Suspense, lazy } from 'react';
import LoginPopup from './components/Login/LoginPopup';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/HomePage/Home';

// Lazy load components
const Shop = lazy(() => import('./pages/ShopPage/Shop'));
const ProductDescription = lazy(() => import('./pages/ShopPage/ProductDescription/ProductDescription'));
const AboutUs = lazy(() => import('./pages/AboutUsPage/AboutUs'));
const Contact = lazy(() => import('./pages/ContactPage/Contact'));
const Cart = lazy(() => import('./pages/CartPage/Cart'));
const OrderPage = lazy(() => import('./pages/OrderPage/OrderPage'));
const Wishlist = lazy(() => import('./pages/WishlistPage/wishlist'));

function App() {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <AuthProvider>
            <Router>
                <div className='app'>
                    {showLogin && (
                        <LoginPopup setShowLogin={setShowLogin} />
                    )}
                    <NavBar setShowLogin={setShowLogin} />
                    <Suspense fallback={<div>Loading...</div>}>
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
                    </Suspense>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
