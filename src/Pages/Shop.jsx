import React, { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { backend_url } from '../App'
import Item from '../Components/Item/Item'
import './CSS/Shop.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUtils'
import { useI18n } from '../utils/i18n'

const Shop = () => {
  const { products, productsLoaded } = useContext(ShopContext)
  const { t } = useI18n()
  const navigate = useNavigate()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [selectedSizes, setSelectedSizes] = useState([])
  const [shopImages, setShopImages] = useState({
    hero: [],
    category: [],
    promotional: [],
    feature: []
  })
  const [collections, setCollections] = useState([])

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Products', fallbackImage: '/api/placeholder/300/200' },
    { id: 'fille', name: 'fille', fallbackImage: '/api/placeholder/300/200' },
    { id: 'garcon', name: 'garcon', fallbackImage: '/api/placeholder/300/200' },
    { id: 'bébé', name: 'bébé', fallbackImage: '/api/placeholder/300/200' }
  ]

  // Sizes available
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

  // Fetch shop images and collections
  useEffect(() => {
    fetchShopImages()
    fetchCollections()
  }, [])

  useEffect(() => {
    if (productsLoaded) {
      setLoading(false)
      applyFilters()
    }
  }, [productsLoaded, products, selectedCategory, sortBy, priceRange, selectedSizes])

  const fetchShopImages = async () => {
    try {
      const response = await axios.get(`${backend_url}/shop-images`)
      if (response.data.success) {
        const imagesByType = response.data.images.reduce((acc, img) => {
          if (!acc[img.imageType]) acc[img.imageType] = []
          acc[img.imageType].push(img)
          return acc
        }, { hero: [], category: [], promotional: [], feature: [] })
        setShopImages(imagesByType)
      }
    } catch (error) {
      console.error('Error fetching shop images:', error)
    }
  }

  const fetchCollections = async () => {
    try {
      const response = await axios.get(`${backend_url}/collections`)
      if (response.data.success) {
        setCollections(response.data.collections)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  // Get category image
  const getCategoryImage = (categoryName) => {
    const categoryImage = shopImages.category.find(img => 
      img.category && img.category.toLowerCase() === categoryName.toLowerCase()
    )
    return categoryImage ? getImageUrl(categoryImage.image) : '/api/placeholder/300/200'
  }

  // Get hero image
  const getHeroImage = () => {
    const heroImage = shopImages.hero[0]
    return heroImage ? getImageUrl(heroImage.image) : '/api/placeholder/600/400'
  }

  // Get promotional images
  const getPromotionalImages = () => {
    return shopImages.promotional.slice(0, 2).map(img => ({
      ...img,
      imageUrl: getImageUrl(img.image)
    }))
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.new_price >= priceRange.min && product.new_price <= priceRange.max
    )

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.new_price - b.new_price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.new_price - a.new_price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'popular':
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleCategoryNavigation = (categoryId) => {
    if (categoryId === 'all') {
      navigate('/')
    } else if (['fille', 'garcon', 'bébé'].includes(categoryId)) {
      navigate(`/${categoryId}`)
    } else {
      // For other cases like 'newest', just filter on current page
      handleCategoryFilter(categoryId)
    }
  }

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSortBy('newest')
    setPriceRange({ min: 0, max: 10000 })
    setSelectedSizes([])
  }

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="loading-spinner"></div>
        <p>{t('loading.generic')}</p>
      </div>
    )
  }

  return (
    <div className="shop loom-bg">
      {/* Hero Section */}
      <section className="shop-hero loom-hero">
        {/* animated ribbon background */}
        <div className="loom-ribbon ribbon-a" aria-hidden></div>
        <div className="loom-ribbon ribbon-b" aria-hidden></div>

        <div className="hero-content">
          <h1 className="hero-title">Play. Shine. Repeat.</h1>
          <p className="hero-subtitle">Outfits that keep up with little adventures — comfy, colorful, and crafted to last.</p>

          <div className="hero-chips">
            <span className="chip">{t('home.new_in')}</span>
            <span className="chip">{t('home.bestsellers')}</span>
            <span className="chip">{t('home.eco_fabrics')}</span>
          </div>

          <div className="cta-row">
            <button className="btn-loom" onClick={() => handleCategoryNavigation('all')}>{t('home.shop_all')}</button>
            <button className="btn-ghost" onClick={() => setSortBy('popular')}>{t('home.trending')}</button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{products.length}+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Quality</span>
            </div>
            <div className="stat">
              <span className="stat-number">Fast</span>
              <span className="stat-label">Delivery</span>
            </div>
          </div>
        </div>

        <div className="hero-image hero-art">
          <img src={getHeroImage()} alt={shopImages.hero[0]?.title || "Kids Fashion"} />
          <span className="glow" aria-hidden></span>
        </div>
      </section>

      {/* Quick category chips */}
      <section className="category-chips">
        <div className="container chips-row">
          {categories.map(c => (
            <button key={c.id} className={`chip chip-link ${selectedCategory === c.id ? 'active' : ''}`} onClick={() => handleCategoryNavigation(c.id)}>
              <span className="dot" /> {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <div className="container">
          <h2 className="section-title">{t('home.shop_by_category')}</h2>
          <div className="featured-grid">
            {getPromotionalImages().map((promo, index) => (
              <div key={promo.id || index} className="featured-card">
                <div className="featured-image">
                  <img 
                    src={promo.imageUrl} 
                    alt={promo.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/600/400';
                    }}
                  />
                  <div className="featured-overlay">
                    <h3>{promo.title}</h3>
                    <p>{promo.description || 'Discover our latest collection'}</p>
                    <button 
                      className="shop-now-btn"
                      onClick={() => {
                        if (promo.category) {
                          handleCategoryNavigation(promo.category.toLowerCase());
                        }
                      }}
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {/* Fallback promotional cards if no images from backend */}
            {getPromotionalImages().length === 0 && [
              {
                title: 'New Arrivals',
                description: 'Fresh styles for little ones',
                image: '/api/placeholder/600/400',
                action: () => handleCategoryFilter('newest')
              },
              {
                title: 'Trending Now', 
                description: 'Popular picks this season',
                image: '/api/placeholder/600/400',
                action: () => setSortBy('popular')
              }
            ].map((fallback, index) => (
              <div key={`fallback-${index}`} className="featured-card">
                <div className="featured-image">
                  <img src={fallback.image} alt={fallback.title} loading="lazy" />
                  <div className="featured-overlay">
                    <h3>{fallback.title}</h3>
                    <p>{fallback.description}</p>
                    <button className="shop-now-btn" onClick={fallback.action}>
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="category-section">
        <div className="container">
          <div className="category-grid">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`category-card ${
                  selectedCategory === category.id ? 'active' : ''
                }`}
                onClick={() => handleCategoryNavigation(category.id)}
              >
                <div className="category-image">
                  <img 
                    src={category.id === 'all' ? category.fallbackImage : getCategoryImage(category.name)} 
                    alt={category.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = category.fallbackImage;
                    }}
                  />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <span className="category-count">
                    {category.id === 'all' 
                      ? products.length 
                      : products.filter(p => p.category?.toLowerCase() === category.id.toLowerCase()).length
                    } items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="collections-section">
        <div className="container">
          <h2 className="section-title">Collections</h2>
          <div className="collections-grid">
            {collections.map(collection => (
              <div key={collection._id} className="collection-card">
                <div className="collection-banner">
                  <img
                    src={collection.bannerImage ? getImageUrl(collection.bannerImage) : '/api/placeholder/600/400'}
                    alt={collection.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/600/400';
                    }}
                  />
                </div>
                <div className="collection-info">
                  <h3>{collection.name}</h3>
                  <div className="collection-products">
                    {/* You can replace with slider component if needed */}
                    {collection.products.slice(0, 4).map(product => (
                      <div key={product._id} className="product-card">
                        <img
                          src={product.image ? getImageUrl(product.image) : '/api/placeholder/300/200'}
                          alt={product.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/300/200';
                          }}
                        />
                        <h4>{product.name}</h4>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="view-all-btn"
                    onClick={() => navigate(`/collections/${collection._id}`)}
                  >
                    View All
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters  Products */}
      <section className="products-section">
        <div className="container">
          {/* Filter Bar */}
          <div className="filter-bar">
            <div className="filter-left">
              <h3>Our Collection</h3>
              <p>{filteredProducts.length} products found</p>
            </div>
            <div className="filter-right">
              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              <button className="clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters">
            <div className="filter-section">
              <h4>Size</h4>
              <div className="size-filters">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${
                      selectedSizes.includes(size) ? 'active' : ''
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-section">
              <h4>Price Range</h4>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                  className="range-slider"
                />
                <div className="price-display">
                  {priceRange.min} د.ج - {priceRange.max} د.ج
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <Item
                  key={product.id || index}
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
                  <p>Try adjusting your filters or browse all categories</p>
                  <button onClick={clearFilters} className="browse-all-btn">
                    Browse All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 7v4a4 4 0 0 0 4 4h2m2-6V9a4 4 0 0 1 4-4h2m-6 15v-6a4 4 0 0 1 4-4h2" />
                </svg>
              </div>
              <h3>Une livraison express</h3>
              <p>pensée pour les clients les plus exigeants, partout en Algérie.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              </div>
              <h3>Une promesse d’excellence</h3>
              <p>la qualité de nos produits est inégalée</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3>Achetez sans stress </h3>
              <p>vous ne payez qu’une fois votre commande livrée</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Shop
