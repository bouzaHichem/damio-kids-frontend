import React, { useContext, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import star_icon from '../Assets/star_icon.png';
import star_dull_icon from '../Assets/star_dull_icon.png';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(ShopContext);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    // Get all available images (main image + additional images)
    const allImages = [
        product.image,
        ...(product.images || []).filter(img => img && img !== product.image)
    ].filter(Boolean);

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Please select a size');
            return;
        }
        if (product.colors && product.colors.length > 0 && !selectedColor) {
            alert('Please select a color');
            return;
        }
        addToCart(product.id);
    };

    const renderStars = () => {
        const stars = [];
        const rating = product.rating || 4.5;
        const fullStars = Math.floor(rating);
        
        for (let i = 0; i < 5; i++) {
            stars.push(
                <img 
                    key={i} 
                    src={i < fullStars ? star_icon : star_dull_icon} 
                    alt="star" 
                />
            );
        }
        return stars;
    };

    const hasDiscount = product.old_price && product.new_price && product.old_price > product.new_price;
    const discountPercentage = hasDiscount 
        ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
        : 0;

    return (
        <div className="product-card">
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="product-card-discount-badge">
                    -{discountPercentage}%
                </div>
            )}

            {/* Image Section */}
            <div className="product-card-images">
                <div className="product-card-thumbnails">
                    {allImages.slice(0, 4).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${product.name} view ${index + 1}`}
                            className={`product-card-thumbnail ${selectedImage === index ? 'active' : ''}`}
                            onClick={() => setSelectedImage(index)}
                        />
                    ))}
                </div>
                <div className="product-card-main-image">
                    <img
                        src={allImages[selectedImage] || product.image}
                        alt={product.name}
                    />
                </div>
            </div>

            {/* Product Details */}
            <div className="product-card-details">
                <div className="product-card-header">
                    <h1>{product.name}</h1>
                    
                    {/* Rating */}
                    <div className="product-card-rating">
                        <div className="product-card-stars">
                            {renderStars()}
                        </div>
                        <p>({product.reviewCount || 122} reviews)</p>
                    </div>
                </div>

                {/* Price Section */}
                <div className="product-card-pricing">
                    <div className="product-card-prices">
                        {hasDiscount ? (
                            <>
                                <span className="product-card-price-new">${product.new_price}</span>
                                <span className="product-card-price-old">${product.old_price}</span>
                            </>
                        ) : (
                            <span className="product-card-price-single">
                                ${product.new_price || product.old_price}
                            </span>
                        )}
                    </div>
                </div>

                {/* Age Range */}
                {product.ageRange && (
                    <div className="product-card-age">
                        <span className="product-card-age-label">Age Range:</span>
                        <span className="product-card-age-value">{product.ageRange}</span>
                    </div>
                )}

                {/* Colors */}
                {product.colors && product.colors.length > 0 && (
                    <div className="product-card-colors">
                        <h3>Colors:</h3>
                        <div className="product-card-color-options">
                            {product.colors.map((color, index) => (
                                <div
                                    key={index}
                                    className={`product-card-color-option ${selectedColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                >
                                    {selectedColor === color && <span className="color-check">✓</span>}
                                </div>
                            ))}
                        </div>
                        {selectedColor && (
                            <span className="selected-color-text">Selected: {selectedColor}</span>
                        )}
                    </div>
                )}

                {/* Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="product-card-sizes">
                        <h3>Size:</h3>
                        <div className="product-card-size-options">
                            {product.sizes.map((size, index) => (
                                <div
                                    key={index}
                                    className={`product-card-size-option ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add to Cart Button */}
                <button 
                    className="product-card-add-to-cart"
                    onClick={handleAddToCart}
                >
                    ADD TO CART
                </button>

                {/* Description */}
                {product.description && (
                    <div className="product-card-description">
                        <p>{product.description}</p>
                    </div>
                )}

                {/* Categories and Tags */}
                <div className="product-card-meta">
                    {product.category && (
                        <div className="product-card-category">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">{product.category}</span>
                        </div>
                    )}
                    
                    {product.tags && product.tags.length > 0 && (
                        <div className="product-card-tags">
                            <span className="meta-label">Tags:</span>
                            <div className="product-card-tag-list">
                                {product.tags.map((tag, index) => (
                                    <span key={index} className="product-card-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
