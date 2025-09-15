import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductSearch from '../Components/ProductSearch/ProductSearch';
import ProductGrid from '../Components/ProductGrid/ProductGrid';
import { backend_url } from '../App';
import axios from 'axios';
import './CSS/AllProducts.css';
import { useI18n } from '../utils/i18n';

const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [filterOptions, setFilterOptions] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  
  const { t } = useI18n();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    subcategories: searchParams.get('subcategories')?.split(',').filter(Boolean) || [],
    priceRange: {
      min: parseInt(searchParams.get('minPrice')) || 0,
      max: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null // do not cap by default
    },
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
    ages: searchParams.get('ages')?.split(',').filter(Boolean) || [],
    colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
    brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
    tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    available: searchParams.get('available') ? searchParams.get('available') === 'true' : null
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  // Update URL parameters
  const updateUrlParams = useCallback((newParams) => {
    const params = new URLSearchParams();
    
    if (newParams.q) params.set('q', newParams.q);
    if (newParams.category && newParams.category !== 'all') params.set('category', newParams.category);
    if (newParams.subcategories?.length > 0) params.set('subcategories', newParams.subcategories.join(','));
    if (newParams.minPrice && newParams.minPrice > 0) params.set('minPrice', newParams.minPrice);
    if (newParams.maxPrice !== null && newParams.maxPrice !== undefined) params.set('maxPrice', newParams.maxPrice);
    if (newParams.sizes?.length > 0) params.set('sizes', newParams.sizes.join(','));
    if (newParams.ages?.length > 0) params.set('ages', newParams.ages.join(','));
    if (newParams.colors?.length > 0) params.set('colors', newParams.colors.join(','));
    if (newParams.brands?.length > 0) params.set('brands', newParams.brands.join(','));
    if (newParams.tags?.length > 0) params.set('tags', newParams.tags.join(','));
    if (newParams.available !== null) params.set('available', newParams.available);
    if (newParams.sortBy && newParams.sortBy !== 'newest') params.set('sortBy', newParams.sortBy);
    if (newParams.page && newParams.page > 1) params.set('page', newParams.page);
    
    setSearchParams(params);
  }, [setSearchParams]);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await axios.get(`${backend_url}/products/filters`);
      if (response.data.success) {
        setFilterOptions(response.data.filters);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const computedQ = (params.searchQuery !== undefined) ? params.searchQuery : searchQuery;
      const searchParams = {
        q: computedQ,
        category: params.filters?.category ?? filters.category,
        subcategories: (params.filters?.subcategories ?? filters.subcategories).join(','),
        minPrice: params.filters?.priceRange?.min ?? filters.priceRange.min,
        maxPrice: params.filters?.priceRange?.max ?? filters.priceRange.max,
        sizes: (params.filters?.sizes ?? filters.sizes).join(','),
        ages: (params.filters?.ages ?? filters.ages).join(','),
        colors: (params.filters?.colors ?? filters.colors).join(','),
        brands: (params.filters?.brands ?? filters.brands).join(','),
        tags: (params.filters?.tags ?? filters.tags).join(','),
        available: (params.filters?.available !== undefined) ? params.filters.available : filters.available,
        sortBy: params.sortBy ?? sortBy,
        sortOrder: 'desc',
        page: params.page ?? currentPage,
        limit: 20
      };

      // Remove empty parameters except allowing empty string for q to clear search
      Object.keys(searchParams).forEach(key => {
        if (key === 'q') return; // keep empty string to mean 'no query'
        if (searchParams[key] === '' || searchParams[key] === null || searchParams[key] === undefined) {
          delete searchParams[key];
        }
      });

      const response = await axios.get(`${backend_url}/products/search`, { params: searchParams });
      
      if (response.data.success) {
        // Apply a defensive client-side filter when q is present, in case backend returns unfiltered results
        const serverProducts = response.data.products || [];
        const q = (computedQ || '').trim().toLowerCase();
        const locallyFiltered = q ? serverProducts.filter(p => {
          const fields = [p?.name, p?.brand, p?.categoryName || p?.category, p?.subcategoryName || p?.subcategory, ...(Array.isArray(p?.tags) ? p.tags : [])]
            .filter(Boolean).map(String).map(s => s.toLowerCase());
          return fields.some(f => f.includes(q));
        }) : serverProducts;

        setProducts(locallyFiltered);
        setPagination(response.data.pagination);
        
        // Update URL
        updateUrlParams({
          q: searchParams.q,
          category: searchParams.category,
          subcategories: params.filters?.subcategories ?? filters.subcategories,
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
          sizes: params.filters?.sizes ?? filters.sizes,
          ages: params.filters?.ages ?? filters.ages,
          colors: params.filters?.colors ?? filters.colors,
          brands: params.filters?.brands ?? filters.brands,
          tags: params.filters?.tags ?? filters.tags,
          available: searchParams.available,
          sortBy: searchParams.sortBy,
          page: searchParams.page
        });
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load products');
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, sortBy, currentPage, updateUrlParams]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    searchProducts({ searchQuery: query, page: 1 });
  }, [searchProducts]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    searchProducts({ filters: newFilters, page: 1 });
  }, [searchProducts]);

  // Handle sort change
  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
    searchProducts({ sortBy: newSortBy, page: 1 });
  }, [searchProducts]);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    searchProducts({ page });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchProducts]);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem('productViewMode', mode);
  }, []);

  // Initial load
  useEffect(() => {
    // Load view mode from localStorage
    const savedViewMode = localStorage.getItem('productViewMode');
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }

    // Fetch filter options and initial products
    fetchFilterOptions();
    searchProducts();
  }, []); // Only run on mount

  // If backend provides price range and no explicit max is set, adopt it
  useEffect(() => {
    if (filterOptions?.priceRange && (filters.priceRange.max === null || filters.priceRange.max === undefined)) {
      setFilters(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          max: filterOptions.priceRange.max || prev.priceRange.max
        }
      }));
    }
  }, [filterOptions]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q') || '');
      setFilters({
        category: params.get('category') || 'all',
        subcategories: params.get('subcategories')?.split(',').filter(Boolean) || [],
        priceRange: {
          min: parseInt(params.get('minPrice')) || 0,
          max: params.get('maxPrice') ? parseInt(params.get('maxPrice')) : null
        },
        sizes: params.get('sizes')?.split(',').filter(Boolean) || [],
        ages: params.get('ages')?.split(',').filter(Boolean) || [],
        colors: params.get('colors')?.split(',').filter(Boolean) || [],
        brands: params.get('brands')?.split(',').filter(Boolean) || [],
        tags: params.get('tags')?.split(',').filter(Boolean) || [],
        available: params.get('available') ? params.get('available') === 'true' : null
      });
      setSortBy(params.get('sortBy') || 'newest');
      setCurrentPage(parseInt(params.get('page')) || 1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="all-products">
      {/* Header */}
      <div className="all-products-header">
        <div className="container">
          <div className="header-content">
            <div className="breadcrumb">
              <button onClick={() => navigate('/')} className="breadcrumb-link">
                {t('nav.home')}
              </button>
              <span className="breadcrumb-separator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </span>
              <span className="breadcrumb-current">{t('nav.all_products')}</span>
            </div>
            
            <div className="header-info">
              <h1>{t('all_products.title')}</h1>
              <p>{t('all_products.tagline')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="all-products-content">
          {/* Search and Filters */}
          <ProductSearch
            onSearch={handleSearch}
            onFilter={handleFilterChange}
            onSort={handleSortChange}
            filters={filters}
            sortOptions={{ sortBy, sortOrder: 'desc' }}
            filterOptions={filterOptions}
            loading={loading}
          />

          {/* Products Grid */}
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={handlePageChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </div>
      </div>

      {/* Quick Stats */}
      {!loading && products.length > 0 && (
        <div className="quick-stats">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{pagination?.totalProducts || 0}+</div>
                  <div className="stat-label">{t('home.stats.products_label')}</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">{t('home.stats.quality_label')}</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">{t('home.stats.fast')}</div>
                  <div className="stat-label">{t('home.stats.delivery_label')}</div>
                </div>
              </div>
              
              <div className="stat-item">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">{t('misc.support')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
