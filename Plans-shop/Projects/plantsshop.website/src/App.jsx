import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import Footer from './components/Footer';
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
import Cart from './components/Cart/Cart';
import { OrderPage } from './components/Cart/OrderPage';

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);

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
                <NavBar setShowLogin={setShowLogin} loggedInUser={loggedInUser} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<OrderPage />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
