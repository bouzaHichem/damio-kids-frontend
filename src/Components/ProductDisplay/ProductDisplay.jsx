import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { currency } from "../../App";
import { getImageUrl, getProductImages } from "../../utils/imageUtils";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  // State for selected variants and main image
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [mainImage, setMainImage] = useState("");

  // Stock count for selected variant or product general stock
  const [stockCount, setStockCount] = useState(0);

  useEffect(() => {
    if (!product) return;

    // Initialize main image to first gallery image or product image
    const productImages = getProductImages(product);
    if (productImages.length > 0) {
      setMainImage(productImages[0]);
    }

    // Initialize selected variants if available
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product.ageRange && typeof product.ageRange === 'object' && product.ageRange.min !== undefined) {
      // If ageRange is object with min/max, select min as default age string
      const ageString = `${product.ageRange.min} - ${product.ageRange.max} months`;
      setSelectedAge(ageString);
    }

    // Initialize stock count fallback to product stock
    if (product.stock_quantity !== undefined) {
      setStockCount(product.stock_quantity);
    }
  }, [product]);

  // Function to determine stock for selected variant if available
  useEffect(() => {
    if (product.variants && selectedSize && selectedColor) {
      const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
      if (variant) {
        setStockCount(variant.stock_quantity || 0);
      } else {
        setStockCount(0);
      }
    } else if (product.stock_quantity !== undefined) {
      setStockCount(product.stock_quantity);
    }
  }, [selectedSize, selectedColor, product]);

  const stockStatus = stockCount === 0 ? "out-of-stock" : stockCount <= 5 ? "low-stock" : "in-stock";

  const handleAddToCart = () => {
    addToCart(product.id, {
      size: selectedSize,
      color: selectedColor,
      age: selectedAge,
    });
  };

  const imageList = getProductImages(product);

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {imageList.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`${product.name} view ${index + 1}`}
              onClick={() => setMainImage(imageUrl)}
              className={mainImage === imageUrl ? 'active' : ''}
            />
          ))}
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={mainImage} alt={product.name} />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {[...Array(4)].map((_, i) => <img key={i} src={star_icon} alt="" />)}
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          {product.old_price && <div className="productdisplay-right-price-old">{currency}{product.old_price}</div>}
          <div className="productdisplay-right-price-new">{currency}{product.new_price}</div>
        </div>

        <div className={`productdisplay-stock-info ${stockStatus}`}>
          {stockStatus === "out-of-stock" ? "Out of Stock"
            : stockStatus === "low-stock" ? `Low Stock - Only ${stockCount} left`
            : `In Stock - ${stockCount} available`}
        </div>

        <div className="productdisplay-right-description">
          {product.description}
        </div>

        {/* Size selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="productdisplay-variant-section">
            <h3>Select Size</h3>
            <div className="productdisplay-right-sizes">
              {product.sizes.map((size) => (
                <div 
                  key={size} 
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Color selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="productdisplay-variant-section">
            <h3>Select Color</h3>
            <div className="productdisplay-colors">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`productdisplay-color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{backgroundColor: color.toLowerCase()}}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Age range selector */}
        {product.ageRange && (
          <div className="productdisplay-variant-section">
            <h3>Age Range</h3>
            <div className="productdisplay-age-range">
              {product.ageRange.min} - {product.ageRange.max} months
            </div>
          </div>
        )}

        <button onClick={handleAddToCart} disabled={stockStatus === "out-of-stock"}>
          {stockStatus === "out-of-stock" ? "OUT OF STOCK" : "ADD TO CART"}
        </button>

        <div className="productdisplay-details">
          <p className="productdisplay-right-category"><span>Category:</span> {product.category}</p>
          {product.brand && <p><span>Brand:</span> {product.brand}</p>}
          {product.material && <p><span>Material:</span> {product.material}</p>}
          {product.weight && <p><span>Weight:</span> {product.weight} g</p>}
          {product.dimensions && <p><span>Dimensions:</span> {`${product.dimensions.length || '-'} x ${product.dimensions.width || '-'} x ${product.dimensions.height || '-'}`} cm</p>}
          {product.care_instructions && <p><span>Care Instructions:</span> {product.care_instructions}</p>}
          {product.sku && <p><span>SKU:</span> {product.sku}</p>}
          {product.tags && product.tags.length > 0 && (
            <div className="productdisplay-tags">
              <span>Tags:</span>
              {product.tags.map((tag) => <span key={tag} className="productdisplay-tag">{tag}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
