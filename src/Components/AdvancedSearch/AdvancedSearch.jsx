import React, { useState, useEffect, useRef } from 'react';
import './AdvancedSearch.css';
import { backend_url } from '../../App';

const AdvancedSearch = ({ onSearchResults, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: '', max: '' },
    sizes: [],
    colors: [],
    brands: [],
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionTimeout = useRef(null);

  const availableSizes = ['Newborn', '0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M', '2T', '3T', '4T', '5T'];
  const availableColors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Black', 'White', 'Gray'];
  const categories = ['garcon', 'fille', 'bébé'];

  useEffect(() => {
    // Focus search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Auto-search when query changes (with debounce)
    if (searchQuery.trim().length >= 2) {
      if (suggestionTimeout.current) {
        clearTimeout(suggestionTimeout.current);
      }
      
      suggestionTimeout.current = setTimeout(() => {
        fetchSuggestions();
        performSearch();
      }, 300);
    } else {
      setSuggestions([]);
      setSearchResults([]);
    }

    return () => {
      if (suggestionTimeout.current) {
        clearTimeout(suggestionTimeout.current);
      }
    };
  }, [searchQuery, filters]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `${backend_url}/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    if (searchQuery.trim().length < 2) return;

    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        q: searchQuery,
        sortBy: filters.sortBy
      });

      if (filters.category) queryParams.append('category', filters.category);
      if (filters.priceRange.min) queryParams.append('minPrice', filters.priceRange.min);
      if (filters.priceRange.max) queryParams.append('maxPrice', filters.priceRange.max);
      if (filters.sizes.length > 0) queryParams.append('sizes', filters.sizes.join(','));
      if (filters.colors.length > 0) queryParams.append('colors', filters.colors.join(','));
      if (filters.brands.length > 0) queryParams.append('brands', filters.brands.join(','));

      const response = await fetch(
        `${backend_url}/api/search/products?${queryParams.toString()}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.results || []);
        // Pass results to parent component
        if (onSearchResults) {
          onSearchResults(data.results || [], searchQuery);
        }
      }
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text || suggestion);
    setSuggestions([]);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'category':
          newFilters.category = value;
          break;
        case 'priceMin':
          newFilters.priceRange.min = value;
          break;
        case 'priceMax':
          newFilters.priceRange.max = value;
          break;
        case 'size':
          if (newFilters.sizes.includes(value)) {
            newFilters.sizes = newFilters.sizes.filter(size => size !== value);
          } else {
            newFilters.sizes = [...newFilters.sizes, value];
          }
          break;
        case 'color':
          if (newFilters.colors.includes(value)) {
            newFilters.colors = newFilters.colors.filter(color => color !== value);
          } else {
            newFilters.colors = [...newFilters.colors, value];
          }
          break;
        case 'sortBy':
          newFilters.sortBy = value;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: { min: '', max: '' },
      sizes: [],
      colors: [],
      brands: [],
      sortBy: 'relevance'
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
      setSuggestions([]);
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  return (
    <div className="advanced-search-overlay">
      <div className="advanced-search-modal">
        <div className="search-header">
          <h2>🔍 Advanced Search</h2>
          <button className="close-btn" onClick={onClose}>❌</button>
        </div>

        <div className="search-input-container">
          <div className="search-input-wrapper">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for products, brands, categories..."
              className="search-input"
            />
            <button 
              className="search-btn"
              onClick={performSearch}
              disabled={loading}
            >
              {loading ? '⏳' : '🔍'}
            </button>
          </div>

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">🔍</span>
                  <span className="suggestion-text">{suggestion.text || suggestion}</span>
                  {suggestion.type && (
                    <span className="suggestion-type">{suggestion.type}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters Toggle */}
        <div className="filters-toggle">
          <button 
            className={`toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            🎛️ Filters {showFilters ? '▼' : '▶'}
          </button>
          {Object.values(filters).some(val => 
            Array.isArray(val) ? val.length > 0 : val !== '' && val !== 'relevance'
          ) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              🗑️ Clear Filters
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="advanced-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label>Category:</label>
                <select 
                  value={filters.category} 
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Sort by:</label>
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Price Range:</label>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                  <span>د.ج</span>
                </div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Sizes:</label>
                <div className="size-filters">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      className={`size-filter ${filters.sizes.includes(size) ? 'active' : ''}`}
                      onClick={() => handleFilterChange('size', size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Colors:</label>
                <div className="color-filters">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      className={`color-filter ${filters.colors.includes(color) ? 'active' : ''}`}
                      onClick={() => handleFilterChange('color', color)}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {filters.colors.includes(color) && '✓'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="search-results">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="results-container">
              <div className="results-header">
                <h3>Search Results ({searchResults.length})</h3>
              </div>
              <div className="results-grid">
                {searchResults.map((product) => (
                  <div key={product._id} className="result-card">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="result-image"
                    />
                    <div className="result-info">
                      <h4 className="result-name">{product.name}</h4>
                      <p className="result-category">{product.category}</p>
                      <div className="result-price">
                        <span className="current-price">{product.new_price} د.ج</span>
                        {product.old_price && (
                          <span className="old-price">{product.old_price} د.ج</span>
                        )}
                      </div>
                      <div className="result-meta">
                        {product.sizes && product.sizes.length > 0 && (
                          <span className="sizes">Sizes: {product.sizes.slice(0, 3).join(', ')}</span>
                        )}
                        {product.colors && product.colors.length > 0 && (
                          <span className="colors">Colors: {product.colors.slice(0, 2).join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery.trim().length >= 2 && !loading ? (
            <div className="no-results">
              <p>🔍 No products found for "{searchQuery}"</p>
              <p>Try different keywords or adjust your filters</p>
            </div>
          ) : (
            <div className="search-placeholder">
              <p>💡 Start typing to search for products...</p>
              <div className="search-tips">
                <h4>Search Tips:</h4>
                <ul>
                  <li>Use specific product names or categories</li>
                  <li>Try searching by color, size, or brand</li>
                  <li>Use filters to narrow down results</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
