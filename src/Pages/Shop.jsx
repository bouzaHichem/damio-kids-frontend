import React, { useEffect, useState, useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { backend_url } from '../App'
import Item from '../Components/Item/Item'
import './CSS/Shop.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUtils'
import { useI18n } from '../utils/i18n'
import ProductSection from '../Components/ProductSection/ProductSection'
import ProductSearch from '../Components/ProductSearch/ProductSearch'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBestSellingProducts, fetchFeaturedProducts, fetchPromoProducts, selectBestSelling, selectFeatured, selectPromo } from '../store/productSectionsSlice'

const Shop = () => {
  const { products, productsLoaded, addToCart } = useContext(ShopContext)
  const { t } = useI18n()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const featured = useSelector(selectFeatured)
  const promo = useSelector(selectPromo)
  const bestSelling = useSelector(selectBestSelling)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  // Enhanced search and filters for sections
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: 'all',
    subcategories: [],
    priceRange: { min: 0, max: null },
    sizes: [],
    ages: [],
    colors: [],
    brands: [],
    tags: [],
    available: null,
  })
  const [filterOptions, setFilterOptions] = useState({})
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
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    if (productsLoaded) {
      setLoading(false)
    }
  }, [productsLoaded])

  // Build params for section API calls based on filters/search/sort
  const buildSectionParams = () => {
    const params = {
      sortBy,
    }
    if (searchQuery) params.q = searchQuery
    if (filters.category && filters.category !== 'all') params.category = filters.category
    if (filters.subcategories?.length) params.subcategories = filters.subcategories.join(',')
    if (filters.sizes?.length) params.sizes = filters.sizes.join(',')
    if (filters.ages?.length) params.ages = filters.ages.join(',')
    if (filters.colors?.length) params.colors = filters.colors.join(',')
    if (filters.brands?.length) params.brands = filters.brands.join(',')
    if (filters.tags?.length) params.tags = filters.tags.join(',')
    if (filters.available !== null && filters.available !== undefined) params.available = filters.available
    if (filters.priceRange?.min !== undefined && filters.priceRange?.min !== null) params.minPrice = filters.priceRange.min
    if (filters.priceRange?.max !== undefined && filters.priceRange?.max !== null) params.maxPrice = filters.priceRange.max
    return params
  }

  // Load dynamic sections whenever filters/sort/search change
  useEffect(() => {
    const params = buildSectionParams()
    dispatch(fetchFeaturedProducts({ page: 1, limit: 8, params }))
    dispatch(fetchPromoProducts({ page: 1, limit: 8, params }))
    dispatch(fetchBestSellingProducts({ page: 1, limit: 8, params }))
  }, [dispatch, searchQuery, filters, sortBy])

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

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${backend_url}/products/filters`)
      if (response.data.success) {
        setFilterOptions(response.data.filters)
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
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

  // Wishlist toggle stored locally for now
  const toggleWishlist = (id) => {
    try {
      const key = 'wishlist'
      const current = JSON.parse(localStorage.getItem(key) || '[]')
      const exists = current.includes(id)
      const next = exists ? current.filter(x => x !== id) : [...current, id]
      localStorage.setItem(key, JSON.stringify(next))
    } catch {}
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

  // Search/Filter/Sort handlers for sections filter
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
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
          <h1 className="hero-title">{t('home.hero_title')}</h1>
          <p className="hero-subtitle">{t('home.hero_subtitle')}</p>

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
              <span className="stat-label">{t('home.stats.products_label')}</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">{t('home.stats.quality_label')}</span>
            </div>
            <div className="stat">
              <span className="stat-number">{t('home.stats.fast')}</span>
              <span className="stat-label">{t('home.stats.delivery_label')}</span>
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
              <span className="dot" /> {(c.id === 'all') ? t('nav.all_products') : (c.id === 'fille') ? t('category.girls') : (c.id === 'garcon') ? t('category.boys') : (c.id === 'bébé') ? t('category.babies') : c.name}
            </button>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="new-section">
        <div className="container">
          <div className="new-header">
            <h2 className="section-title">{t('home.new_in')}</h2>
            <p className="new-subtitle">{t('home.trending')}</p>
          </div>
          <div className="new-grid">
            {(() => {
              const now = Date.now();
              const recencyMs = 1000 * 60 * 60 * 24 * 30; // 30 days
              const list = (products || []).filter(p => p?.newCollection || p?.isNew || (p?.date && (now - new Date(p.date).getTime() < recencyMs))).slice(0, 8);
              return list.map((p, i) => {
                const id = p.id ?? p._id ?? i;
                return (
                  <div className="new-card reveal" style={{['--d']: `${i * 40}ms`}} key={id}>
                    <div className="new-badge">{t('home.new_in')}</div>
                    <div className="new-media">
                      <img src={getImageUrl(p.image)} alt={p.name} loading="lazy" onError={(e) => { e.target.src = '/api/placeholder/600/400'}} />
                      <div className="new-overlay" aria-hidden>
                        <div className="new-actions" role="group" aria-label="Quick actions">
                          <button className="new-btn primary" onClick={() => addToCart(id)}>{t('action.add_to_cart')}</button>
                          <button className="new-btn icon" onClick={() => toggleWishlist(id)} aria-label="Wishlist">❤</button>
                          <button className="new-btn icon" onClick={() => navigate(`/product/${id}`)} aria-label="Quick view">👁</button>
                        </div>
                      </div>
                    </div>
                    <div className="new-info">
                      <h3 className="new-title">{p.name}</h3>
                      <p className="new-desc">{p.description || ' '}</p>
                      <div className="new-price">{p.new_price}<span className="cur"> د.ج</span></div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
          <div className="new-cta">
            <a className="view-all-new" href="/products?sortBy=newest">{t('home.view_all_new')}</a>
          </div>
        </div>
      </section>

      {/* Filters for sections */}
      <section className="home-filters container">
        <ProductSearch
          onSearch={handleSearch}
          onFilter={handleFilterChange}
          onSort={handleSortChange}
          filters={filters}
          sortOptions={{ sortBy, sortOrder: 'desc' }}
          filterOptions={filterOptions}
          loading={featured.status==='loading' || promo.status==='loading' || bestSelling.status==='loading'}
        />
      </section>

      {/* Dynamic Product Sections replacing Shop by Category */}
      <ProductSection
        variant="featured"
        title={t('home.featured_products')}
        subtitle="Our hand-picked favorites this week"
        products={featured.items}
        loading={featured.status==='loading'}
        error={featured.error}
      />
      <ProductSection
        variant="promo"
        title={t('home.promo_products')}
        subtitle="Grab them before they're gone!"
        products={promo.items}
        loading={promo.status==='loading'}
        error={promo.error}
      />
      <ProductSection
        variant="best"
        title={t('home.best_selling_products')}
        subtitle="Top choices loved by our customers"
        products={bestSelling.items}
        loading={bestSelling.status==='loading'}
        error={bestSelling.error}
      />

      {/* Collections Section */}
      <section className="collections-section">
        <div className="container">
          <h2 className="section-title">{t('home.collections')}</h2>
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
                    {/* Preview a few products from this collection */}
                    {Array.isArray(collection.products) && collection.products.slice(0, 4).map((product, index) => {
                      const id = product.id ?? product._id ?? index;
                      const hasDiscount = Number(product.old_price) > Number(product.new_price);
                      const discountPct = hasDiscount
                        ? Math.round(((Number(product.old_price) - Number(product.new_price)) / Number(product.old_price)) * 100)
                        : 0;
                      return (
                        <div key={id} className="product-card fade-in">
                          {hasDiscount && (
                            <span className="discount-badge">-{discountPct}%</span>
                          )}
                          <img
                            src={product.image ? getImageUrl(product.image) : '/api/placeholder/300/200'}
                            alt={product.name}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = '/api/placeholder/300/200';
                            }}
                          />
                          <h4 className="product-title">{product.name}</h4>
                          <div className="price-row">
                            <span className="price-new">{product.new_price}<span className="cur"> د.ج</span></span>
                            {hasDiscount && (
                              <span className="price-old">{product.old_price} د.ج</span>
                            )}
                          </div>
                          <button
                            className="mini-add-btn"
                            onClick={() => addToCart(id)}
                          >
                            {t('action.add_to_cart')}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    className="view-all-btn"
                    onClick={() => navigate(`/collections/${collection._id}`)}
                  >
                    {t('action.view_all')}
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
              <h3>{t('shop.collection_heading')}</h3>
              <p>{t('search.results_count', { count: filteredProducts.length })}</p>
            </div>
            <div className="filter-right">
              <div className="filter-group">
                <label>{t('filter.sort_by')}</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">{t('filter.sort.newest')}</option>
                  <option value="popular">{t('filter.sort.popular')}</option>
                  <option value="price-low">{t('filter.sort.price_low')}</option>
                  <option value="price-high">{t('filter.sort.price_high')}</option>
                </select>
              </div>
              <button className="clear-filters" onClick={clearFilters}>
                {t('filter.clear_filters')}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters">
            <div className="filter-section">
              <h4>{t('product.size')}</h4>
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
              <h4>{t('filter.price_range')}</h4>
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
                  <h3>{t('search.no_results')}</h3>
                  <p>{t('search.try_adjusting')}</p>
                  <button onClick={clearFilters} className="browse-all-btn">
                    {t('search.browse_all_products')}
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
              <h3>{t('home.feature_fast_delivery.title')}</h3>
              <p>{t('home.feature_fast_delivery.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                </svg>
              </div>
              <h3>{t('home.feature_quality.title')}</h3>
              <p>{t('home.feature_quality.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 0v10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3>{t('home.feature_cod.title')}</h3>
              <p>{t('home.feature_cod.desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Shop
