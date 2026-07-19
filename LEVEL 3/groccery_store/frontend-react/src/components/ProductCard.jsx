import React from 'react';
import '../styles/productCard.css';

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isLoggedIn,
  getProductIconClass
}) {
  const inStock = Number(product.stock) > 0;

  return (
    <div className="product-card-shop">
      {/* Product Image Section */}
      <div className="product-image-container">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image-shop"
          />
        ) : (
          <div className="product-image-placeholder">
            <i className={getProductIconClass(product.iconCategory || product.category)}></i>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="out-of-stock-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="product-info-shop">
        {/* Product Name */}
        <h3 className="product-name-shop">{product.name}</h3>

        {/* Weight/Size */}
        {product.weight && (
          <p className="product-weight">{product.weight}</p>
        )}

        {/* Price Section */}
        <div className="price-section">
          <span className="current-price">Rs. {product.price}</span>
        </div>

        {/* Stock Status */}
        <p className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
          {inStock ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </p>

        {/* Actions */}
        <div className="product-actions-shop">
          <button
            className={`btn-add-to-cart-shop ${!inStock ? 'disabled' : ''} ${!isLoggedIn ? 'login-required' : ''}`}
            disabled={!inStock}
            onClick={() => onAddToCart(product)}
            title={!isLoggedIn ? 'Login to add to cart' : !inStock ? 'Out of stock' : 'Add to cart'}
          >
            <span>{isLoggedIn ? 'ADD TO CART' : 'LOGIN TO BUY'}</span>
          </button>
          <button
            className="btn-wishlist-shop"
            onClick={() => onAddToWishlist(product)}
            title="Add to wishlist"
          >
            <i className="fas fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
