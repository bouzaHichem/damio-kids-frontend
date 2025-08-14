import React, { useContext } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import { currency } from '../../App';
import { ShopContext } from '../../Context/ShopContext';
import PropTypes from 'prop-types';
import Rating from '../Rating'; // Assume a rating component is available
import { getImageUrl, handleImageError } from '../../utils/imageUtils';

const Item = ({
  id, image, name, new_price, old_price, isNew,
  availability, sizes, colors, ratings, reviewCount,
  stockQuantity, featured, viewType, onErrorImage
}) => {
  const { addToCart } = useContext(ShopContext);

  // Calculate discount percentage
  const discountPercentage = old_price && new_price ? 
    Math.round(((old_price - new_price) / old_price) * 100) : 0;

  // Determine badges
  const isOnSale = discountPercentage > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/product/${id}`;
  };

  // Image fallback
  const handleImageErrorFallback = (e) => {
    handleImageError(e, onErrorImage || '/default-product-image.jpg');
  };

  return (
    <div className={`item ${viewType}`}>
      <div className="item-image-container">
        <Link to={`/product/${id}`}>
          <img onClick={window.scrollTo(0, 0)} src={getImageUrl(image)} alt="product image" onError={handleImageErrorFallback} />
        </Link>

        {/* Badges */}
        <div className="item-badges">
          {isNew && <span className="badge badge-new">NEW</span>}
          {isOnSale && <span className="badge badge-sale">-{discountPercentage}%</span>}
          {featured && <span className="badge badge-featured">Featured</span>}
        </div>

        {/* Overlay with quick actions */}
        <div className="item-overlay">
          <button className="quick-view-btn" onClick={handleQuickView}>Quick View</button>
        </div>
      </div>

      <div className="item-content">
        <p className="item-name">{name}</p>

        {/* Price Section */}
        <div className="item-prices">
          <div className="item-price-new">{currency}{new_price}</div>
          {old_price && old_price !== new_price && (
            <div className="item-price-old">{currency}{old_price}</div>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="item-rating">
          <Rating value={ratings} />
          <span>{reviewCount} reviews</span>
        </div>

        {/* Availability and Stock */}
        <div className="item-stock">
          {availability}&nbsp;-&nbsp;{stockQuantity} in stock
        </div>

        {/* Sizes and Colors */}
        <div className="item-variations">
          <div className="item-sizes">Sizes: {sizes.join(', ')}</div>
          <div className="item-colors">Colors: {colors.join(', ')}</div>
        </div>

        {/* Actions */}
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  new_price: PropTypes.number.isRequired,
  old_price: PropTypes.number,
  isNew: PropTypes.bool,
  availability: PropTypes.string,
  sizes: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  ratings: PropTypes.number,
  reviewCount: PropTypes.number,
  stockQuantity: PropTypes.number,
  featured: PropTypes.bool,
  viewType: PropTypes.oneOf(['grid', 'list']),
  onErrorImage: PropTypes.string
};

Item.defaultProps = {
  isNew: false,
  availability: 'In stock',
  sizes: [],
  colors: [],
  ratings: 0,
  reviewCount: 0,
  stockQuantity: 0,
  featured: false,
  viewType: 'grid',
  onErrorImage: ''
};

export default Item;
