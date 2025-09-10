import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { backend_url } from '../App';
import Item from '../Components/Item/Item';
import axios from 'axios';
import './CSS/CollectionPage.css';
import { useI18n } from '../utils/i18n';

const CollectionPage = () => {
  const { t } = useI18n();
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
        <p>{t('collection.loading')}</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collection-not-found">
        <h2>{t('collection.not_found')}</h2>
        <p>{t('collection.not_found_desc')}</p>
        <button onClick={() => navigate('/')} className="back-to-shop-btn">
          {t('action.back_to_shop')}
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
                  {t('collection.hero_desc', { name: (collection.name || '').toLowerCase(), count: collection.products.length })}
                </p>
                <div className="collection-stats">
                  <span className="stat">
                    <strong>{collection.products.length}</strong> {t('home.stats.products_label')}
                  </span>
                  <span className="stat">
                    <strong>{t('collection.premium_quality')}</strong>
                  </span>
                  <span className="stat">
                    <strong>{t('home.stats.fast')}</strong> {t('home.stats.delivery_label')}
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
            <span onClick={() => navigate('/')} className="breadcrumb-link">{t('nav.home')}</span>
            <span className="breadcrumb-separator">/</span>
            <span onClick={() => navigate('/')} className="breadcrumb-link">{t('nav.shop')}</span>
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
                <h2>{t('collection.title', { name: collection.name })}</h2>
                <p>{t('collection.products_available', { count: filteredProducts.length })}</p>
              </div>
              <div className="filter-right">
                <div className="sort-group">
                  <label>{t('filter.sort_by')}</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">{t('filter.sort.newest')}</option>
                    <option value="popular">{t('filter.sort.popular')}</option>
                    <option value="price-low">{t('filter.sort.price_low')}</option>
                    <option value="price-high">{t('filter.sort.price_high')}</option>
                    <option value="name-az">{t('filter.sort.name_az')}</option>
                    <option value="name-za">{t('filter.sort.name_za')}</option>
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
                  <h3>{t('search.no_results')}</h3>
                  <p>{t('collection.empty_desc')}</p>
                  <button onClick={() => navigate('/shop')} className="browse_all-btn">
                    {t('search.browse_all_products')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Collection Actions */}
          <div className="collection-actions">
            <button onClick={() => navigate('/shop')} className="back-to-shop-btn">
              {t('action.back_to_shop')}
            </button>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              {t('cart.continue_shopping')}
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
              <h3>{t('collection.feature.curated.title')}</h3>
              <p>{t('collection.feature.curated.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>{t('collection.feature.premium.title')}</h3>
              <p>{t('collection.feature.premium.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>{t('collection.feature.shipping.title')}</h3>
              <p>{t('collection.feature.shipping.desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CollectionPage;
