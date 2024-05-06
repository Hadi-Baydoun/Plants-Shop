import React from 'react';

function Card({ product }) {
    return (
        <div className="card">
            <img src={product.Image_url} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Rating: {product.rating}</p>
            <p>Quantity: {product.quantity}</p>
            <p>Price: ${product.price}</p>
            <p>Category: {product.subCategories?.category?.name}</p>
            <p>SubCategory: {product.subCategories?.name}</p>
        </div>
    );
}

export default Card;
