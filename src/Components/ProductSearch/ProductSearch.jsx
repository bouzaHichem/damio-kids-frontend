import React, { useState, useEffect } from 'react';
import './ProductSearch.css';

const ProductSearch = ({ 
  onSearch, 
  onFilter, 
  onSort, 
  filters = {}, 
  sortOptions = {}, 
  filterOptions = {},
  loading = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: 'all',
    priceRange: { min: 0, max: 10000 },
    sizes: [],
    colors: [],
    brands: [],
    tags: [],
    available: null
  });
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    // Update active filters when props change
    setActiveFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (filterType, value) => {
    let newFilters = { ...activeFilters };

    if (filterType === 'sizes' || filterType === 'colors' || filterType === 'brands' || filterType === 'tags') {
      const currentArray = newFilters[filterType] || [];
      if (currentArray.includes(value)) {
        newFilters[filterType] = currentArray.filter(item => item !== value);
      } else {
        newFilters[filterType] = [...currentArray, value];
      }
    } else if (filterType === 'priceRange') {
      newFilters.priceRange = { ...newFilters.priceRange, ...value };
    } else {
      newFilters[filterType] = value;
    }

    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    onSort(sortValue);
  };

  const clearAllFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: { min: 0, max: 10000 },
      sizes: [],
      colors: [],
      brands: [],
      tags: [],
      available: null
    };
    setActiveFilters(defaultFilters);
    setSearchQuery('');
    onFilter(defaultFilters);
    onSearch('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category !== 'all') count++;
    if (activeFilters.sizes.length > 0) count++;
    if (activeFilters.colors.length > 0) count++;
    if (activeFilters.brands.length > 0) count++;
    if (activeFilters.tags.length > 0) count++;
    if (activeFilters.available !== null) count++;
    if (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000) count++;
    return count;
  };

  return (
    <div className="product-search">
      {/* Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search products by name, category, or tags..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            disabled={loading}
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="search-controls">
        <div className="controls-left">
          <button 
            className={`filter-toggle ${isFilterOpen ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
            </svg>
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="filter-count">{getActiveFilterCount()}</span>
            )}
          </button>

          {getActiveFilterCount() > 0 && (
            <button className="clear-filters" onClick={clearAllFilters}>
              Clear All
            </button>
          )}
        </div>

        <div className="controls-right">
          <div className="sort-control">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              disabled={loading}
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {isFilterOpen && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={activeFilters.category === 'all'}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  All Categories
                </label>
                {filterOptions.categories?.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category.name}
                      checked={activeFilters.category === category.name}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range-filter">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => handleFilterChange('priceRange', { min: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => handleFilterChange('priceRange', { max: parseInt(e.target.value) || 10000 })}
                    min="0"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max={filterOptions.priceRange?.max || 10000}
                  value={activeFilters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', { max: parseInt(e.target.value) })}
                  className="price-slider"
                />
                <div className="price-display">
                  {activeFilters.priceRange.min} د.ج - {activeFilters.priceRange.max} د.ج
                </div>
              </div>
            </div>

            {/* Size Filter */}
            {filterOptions.sizes?.length > 0 && (
              <div className="filter-group">
                <h4>Sizes</h4>
                <div className="size-filters">
                  {filterOptions.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-btn ${activeFilters.sizes.includes(size) ? 'active' : ''}`}
                      onClick={() => handleFilterChange('sizes', size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Filter */}
            {filterOptions.colors?.length > 0 && (
              <div className="filter-group">
                <h4>Colors</h4>
                <div className="color-filters">
                  {filterOptions.colors.map(color => (
                    <label key={color} className="color-option">
                      <input
                        type="checkbox"
                        checked={activeFilters.colors.includes(color)}
                        onChange={() => handleFilterChange('colors', color)}
                      />
                      <span className="color-name">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Filter */}
            {filterOptions.brands?.length > 0 && (
              <div className="filter-group">
                <h4>Brands</h4>
                <div className="brand-filters">
                  {filterOptions.brands.map(brand => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={activeFilters.brands.includes(brand)}
                        onChange={() => handleFilterChange('brands', brand)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Availability Filter */}
            <div className="filter-group">
              <h4>Availability</h4>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={activeFilters.available === null}
                    onChange={() => handleFilterChange('available', null)}
                  />
                  All Products
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={activeFilters.available === true}
                    onChange={() => handleFilterChange('available', true)}
                  />
                  In Stock Only
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="availability"
                    checked={activeFilters.available === false}
                    onChange={() => handleFilterChange('available', false)}
                  />
                  Out of Stock
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
