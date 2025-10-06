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

    const addMany = (arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((s) => {
        if (s === null || s === undefined) return;
        const val = typeof s === 'string' || typeof s === 'number' ? String(s) : (s?.label || s?.value);
        if (val) set.add(val);
      });
    };

    // 1) Common fields on product
    addMany(product?.sizes);
    addMany(product?.customSizes);
    addMany(product?.shoeSizes);
    addMany(product?.availableSizes);

    // 2) Variants may be an object with arrays (e.g., { sizes: [], ageGroups: [] })
    if (product?.variants && !Array.isArray(product.variants) && typeof product.variants === 'object') {
      addMany(product.variants.sizes);
      addMany(product.variants.sizeOptions);
      addMany(product.variants.ageGroups);
      addMany(product.variants.shoeSizes);
      // Generic scan for any array prop with "size" in the key
      Object.entries(product.variants).forEach(([k, v]) => {
        if (/size/i.test(k)) addMany(v);
      });
    }

    // 3) Variants may be an array of variant objects
    if (Array.isArray(product?.variants)) {
      product.variants.forEach((v) => {
        if (!v || typeof v !== 'object') return;
        if (v.size) set.add(String(v.size));
        if (Array.isArray(v.sizes)) addMany(v.sizes);
        if (v.attributes && typeof v.attributes === 'object') {
          // Common patterns like attributes.Size or attributes.size
          const maybe = v.attributes.Size || v.attributes.size || v.attributes["SIZE"];
          addMany(maybe);
          if (typeof maybe === 'string' || typeof maybe === 'number') set.add(String(maybe));
        }
      });
    }

    // 4) Last resort: scan product object for any array field with size-like key
    if (product && typeof product === 'object') {
      Object.entries(product).forEach(([k, v]) => {
        const kl = String(k).toLowerCase();
        // include fields that are clearly size-related, avoid matching 'images'
        if (kl === 'sizes' || kl.endsWith('sizes') || kl.includes('sizeoptions')) addMany(v);
        // include age-related arrays but avoid 'image(s)'
        if (kl.startsWith('age') || kl.includes('agegroup')) addMany(v); // 3Y, 5Y, etc.
      });
    }

    return Array.from(set);
  }, [product]);

  // Fallback sizes when backend has none: derive from ageRange or category
  const fallbackSizes = useMemo(() => {
    // 1) Derive from ageRange in months (convert to years labels like 3Y..10Y)
    const minM = Number(product?.ageRange?.min);
    const maxM = Number(product?.ageRange?.max);
    if (Number.isFinite(minM) && Number.isFinite(maxM) && maxM > 0) {
      const minY = Math.max(1, Math.round(minM / 12));
      const maxY = Math.max(minY, Math.round(maxM / 12));
      const list = [];
      for (let y = minY; y <= maxY; y++) list.push(`${y}Y`);
      if (list.length) return list;
    }

    const cat = (product?.categoryName || product?.category || '').toLowerCase();
    const sub = (product?.subcategoryName || product?.subcategory || '').toLowerCase();

    // 2) Shoes
    if (cat.includes('chaussures') || sub.includes('chaussures')) {
      return ['24','25','26','27','28','29','30','31','32','33','34','35'];
    }

    // 3) Baby (months)
    if (cat.includes('bébé') || sub.includes('bébé') || sub.includes('bebe')) {
      return ['0-3M','3-6M','6-9M','9-12M','12-18M','18-24M'];
    }

    // 4) Kids clothing (years)
    if (cat.includes('filles') || cat.includes('garçon') || cat.includes('garcon') || sub.includes('pulls') || sub.includes('pantalons') || sub.includes('vestes') || sub.includes('robes')) {
      return ['3Y','4Y','5Y','6Y','7Y','8Y','9Y','10Y','12Y'];
    }

    // 5) Letter sizes fallback
    return ['XS','S','M','L','XL'];
  }, [product]);

  const displaySizes = allSizes.length > 0 ? allSizes : fallbackSizes;

  const requiresSize = Array.isArray(displaySizes) && displaySizes.length > 0;
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

        {/* Size selector (merged + fallbacks: sizes, customSizes, shoeSizes, variant sizes, derived) */}
        {displaySizes && displaySizes.length > 0 && (
          <div className="productdisplay-variant-section">
            <h3>Select Size</h3>
            <div className="productdisplay-right-sizes">
              {displaySizes.map((size) => (
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
