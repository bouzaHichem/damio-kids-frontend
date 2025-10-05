import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { currency } from "../../App";
import { getProductImages } from "../../utils/imageUtils";
import { toast } from "react-hot-toast";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  // State for selected variants and main image
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const galleryRef = useRef(null);

  // Stock count for selected variant or product general stock
  const [stockCount, setStockCount] = useState(0);

  useEffect(() => {
    if (!product) return;

    // Initialize main image to first gallery image or product image
    const productImages = getProductImages(product);
    if (productImages.length > 0) {
      setMainImage(productImages[0]);
    }

    // Do not auto-select size/color; user must choose explicitly if required
    if (product.ageRange && typeof product.ageRange === 'object' && product.ageRange.min !== undefined) {
      // Age is informational; not enforced as required unless part of product.variants
      const ageString = `${product.ageRange.min} - ${product.ageRange.max} months`;
      setSelectedAge(ageString);
    }

    // Initialize stock count fallback to product stock
    if (product.stock_quantity !== undefined && product.stock_quantity !== null) {
      setStockCount(product.stock_quantity);
    }
  }, [product]);

  // Function to determine stock for selected variant if available
  useEffect(() => {
    if (product?.variants && selectedSize && selectedColor) {
      const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
      if (variant) {
        setStockCount(variant.stock_quantity || 0);
      } else {
        setStockCount(0);
      }
    } else if (product?.stock_quantity !== undefined && product?.stock_quantity !== null) {
      setStockCount(product.stock_quantity);
    }
  }, [selectedSize, selectedColor, product]);

  const stockStatus = stockCount === 0 ? "out-of-stock" : stockCount <= 5 ? "low-stock" : "in-stock";

  // Consolidate all size-like options: variant sizes, clothing sizes, custom sizes, and shoe sizes
  const allSizes = useMemo(() => {
    const set = new Set();
    // 1) Sizes from explicit arrays
    (product?.sizes || []).forEach(s => s && set.add(String(s)));
    (product?.customSizes || []).forEach(s => s && set.add(String(s)));
    (product?.shoeSizes || []).forEach(s => s && set.add(String(s)));
    // 2) Sizes derived from variant objects
    if (Array.isArray(product?.variants)) {
      product.variants.forEach(v => {
        const vs = v?.size;
        if (vs) set.add(String(vs));
      });
    }
    return Array.from(set);
  }, [product]);

  const requiresSize = Array.isArray(allSizes) && allSizes.length > 0;
  const requiresColor = Array.isArray(product.colors) && product.colors.length > 0;
  const isVariantValid = (!requiresSize || !!selectedSize) && (!requiresColor || !!selectedColor);
  const isAddDisabled = stockStatus === "out-of-stock" || !isVariantValid;

  const maxQty = Math.max(1, Number(stockCount) || 10);
  const inc = () => setQuantity(q => Math.min(maxQty, q + 1));
  const dec = () => setQuantity(q => Math.max(1, q - 1));

  const trySetImageForColor = (color) => {
    const imgs = getProductImages(product);
    const lower = String(color || '').toLowerCase();
    const match = imgs.findIndex(u => String(u).toLowerCase().includes(lower));
    if (match >= 0) {
      setMainImage(imgs[match]);
      if (galleryRef.current?.slideToIndex) galleryRef.current.slideToIndex(match);
    }
  };

  const handleAddToCart = () => {
    if (!isVariantValid) return;
    addToCart(product.id, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      age: selectedAge || undefined,
    }, quantity);
    toast.success(`${quantity} × ${product.name} added to cart${selectedColor ? ` • ${selectedColor}` : ''}${selectedSize ? ` • size ${selectedSize}` : ''}`);
  };

  const imageList = getProductImages(product);
  const galleryItems = imageList.map((url) => ({ original: url, thumbnail: url }));
  const renderItem = (item) => (
    <div className={`image-zoom-wrap ${zoom ? 'zoomed' : ''}`} onClick={() => setZoom((z) => !z)}>
      <img src={item.original} alt={product.name} />
    </div>
  );

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-gallery">
          <ImageGallery
            ref={galleryRef}
            items={galleryItems}
            showPlayButton={false}
            showFullscreenButton={true}
            showIndex={true}
            slideOnThumbnailOver={true}
            onSlide={(idx) => { setMainImage(imageList[idx]); setZoom(false); }}
            renderItem={renderItem}
          />
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
          {product.old_price ? <div className="productdisplay-right-price-old">{currency}{product.old_price}</div> : null}
          <div className="productdisplay-right-price-new">{currency}{product.new_price}</div>
        </div>

        <div className={`productdisplay-stock-info ${stockStatus}`}>
          {stockStatus === "out-of-stock" ? "Out of Stock"
            : stockStatus === "low-stock" ? `Low Stock - Only ${stockCount} left`
            : `In Stock${stockCount ? ` - ${stockCount} available` : ''}`}
        </div>

        <div className="productdisplay-right-description">
          {product.description}
        </div>

        {/* Size selector (merged: sizes, customSizes, shoeSizes, variant sizes) */}
        {allSizes && allSizes.length > 0 && (
          <div className="productdisplay-variant-section">
            <h3>Select Size</h3>
            <div className="productdisplay-right-sizes">
              {allSizes.map((size) => (
                <div
                  key={size}
                  className={selectedSize === size ? 'selected' : ''}
                  onClick={() => setSelectedSize(size)}
                  role="button"
                  aria-label={`Select size ${size}`}
                >
                  {size}
                </div>
              ))}
            </div>
            <p className="size-helper">Please select a size (shoe sizes, clothing sizes like XS–XL, or age sizes like 3Y, 5Y).</p>
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
                  style={{ backgroundColor: color.toLowerCase() }}
                  onClick={() => { setSelectedColor(color); trySetImageForColor(color); }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity selector */}
        <div className="qty-row">
          <span className="qty-label">Quantity</span>
          <div className="qty-box">
            <button aria-label="Decrease quantity" onClick={dec} disabled={quantity <= 1}>-</button>
            <input aria-label="Quantity" readOnly value={quantity} />
            <button aria-label="Increase quantity" onClick={inc} disabled={quantity >= maxQty}>+</button>
          </div>
        </div>

        {/* Age range info */}
        {product.ageRange && (
          <div className="productdisplay-variant-section">
            <h3>Age Range</h3>
            <div className="productdisplay-age-range">
              {product.ageRange.min} - {product.ageRange.max} months
            </div>
          </div>
        )}

        <button className="btn-add" onClick={handleAddToCart} disabled={isAddDisabled}>
          {stockStatus === "out-of-stock" ? "OUT OF STOCK" : (!isVariantValid ? "SELECT OPTIONS" : "ADD TO CART")}
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

      {/* Sticky mobile ATC bar */}
      <div className="sticky-atc">
        <div className="sticky-inner">
          <div className="sticky-price">{currency}{product.new_price}</div>
          <div className="qty-box">
            <button aria-label="Decrease quantity" onClick={dec} disabled={quantity <= 1}>-</button>
            <input aria-label="Quantity" readOnly value={quantity} />
            <button aria-label="Increase quantity" onClick={inc} disabled={quantity >= maxQty}>+</button>
          </div>
          <button className="btn-add" onClick={handleAddToCart} disabled={isAddDisabled}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
