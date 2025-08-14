import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backend_url } from '../App';
import Item from '../Components/Item/Item';
import axios from 'axios';
import './CSS/CollectionPage.css';

const CollectionPage = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchCollection();
  }, [collectionId]);

  useEffect(() => {
    if (collection && collection.products) {
      applySort();
    }
  }, [collection, sortBy]);

  const fetchCollection = async () => {
    try {
      const response = await axios.get(`${backend_url}/collections`);
      if (response.data.success) {
        const foundCollection = response.data.collections.find(c => c._id === collectionId);
        if (foundCollection) {
          setCollection(foundCollection);
          setFilteredProducts(foundCollection.products);
        } else {
          navigate('/shop');
        }
      }
    } catch (error) {
      console.error('Error fetching collection:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    return `${backend_url}${imagePath}`;
  };

  const applySort = () => {
    if (!collection || !collection.products) return;

    let sorted = [...collection.products];
    
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.new_price - b.new_price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.new_price - a.new_price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
      case 'name-az':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(sorted);
  };

  if (loading) {
    return (
      <div className="collection-loading">
        <div className="loading-spinner"></div>
        <p>Loading collection...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collection-not-found">
        <h2>Collection Not Found</h2>
        <p>The collection you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="back-to-shop-btn">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="collection-page">
      {/* Collection Hero */}
      <section className="collection-hero">
        <div className="collection-banner">
          {collection.bannerImage ? (
            <img
              src={getImageUrl(collection.bannerImage)}
              alt={collection.name}
              className="banner-image"
            />
          ) : (
            <div className="banner-placeholder">
              <h1>{collection.name}</h1>
            </div>
          )}
          <div className="banner-overlay">
            <div className="container">
              <div className="collection-info">
                <h1>{collection.name}</h1>
                <p className="collection-description">
                  Discover our carefully curated {collection.name.toLowerCase()} featuring {collection.products.length} premium items for your little ones.
                </p>
                <div className="collection-stats">
                  <span className="stat">
                    <strong>{collection.products.length}</strong> Products
                  </span>
                  <span className="stat">
                    <strong>Premium</strong> Quality
                  </span>
                  <span className="stat">
                    <strong>Fast</strong> Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="container">
          <nav>
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span onClick={() => navigate('/')} className="breadcrumb-link">Shop</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{collection.name}</span>
          </nav>
        </div>
      </section>

      {/* Products Section */}
      <section className="collection-products">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-left">
              <h2>{collection.name} Collection</h2>
              <p>{filteredProducts.length} products available</p>
            </div>
            <div className="filter-right">
              <div className="sort-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <Item
                  key={product._id || index}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  new_price={product.new_price}
                  old_price={product.old_price}
                  isNew={product.newCollection}
                />
              ))
            ) : (
              <div className="no-products">
                <div className="no-products-content">
                  <h3>No products found</h3>
                  <p>This collection is currently empty.</p>
                  <button onClick={() => navigate('/shop')} className="browse-all-btn">
                    Browse All Products
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collection Actions */}
          <div className="collection-actions">
            <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
              Back to Shop
            </button>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </section>

      {/* Collection Features */}
      <section className="collection-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Curated Selection</h3>
              <p>Each item in this collection has been carefully selected for quality and style</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Premium Quality</h3>
              <p>Made from the finest materials with attention to every detail</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Quick and reliable delivery across Algeria for all collection items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionPage;
