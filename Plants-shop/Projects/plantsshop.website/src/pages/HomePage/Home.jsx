import React, { Suspense, lazy } from 'react';
import Hero from './HeroSection/Hero';

// Lazy load the components
const AboutUsHome = lazy(() => import('./AboutUsSection/AboutUsHome'));
const Arrivals = lazy(() => import('./ArrivalsSection/Arrivals'));
const Features = lazy(() => import('./FeaturesSection/Features'));
const Reasons = lazy(() => import('./ReasonsSection/Reasons'));
const Testimonials = lazy(() => import('./TestimonialsSection/Testimonials'));

export default function Home({ loggedInUser, cartId, setCartId, wishlistId, setWishlistId }) {
    return (
        <div className="home">
            <Hero />
            <Suspense fallback={<div>Loading...</div>}>
                <Features />
                <Arrivals loggedInUser={loggedInUser} cartId={cartId} setCartId={setCartId} wishlistId={wishlistId} setWishlistId={setWishlistId} />
                <AboutUsHome />
                <Reasons />
                <Testimonials />
            </Suspense>
        </div>
    );
}
