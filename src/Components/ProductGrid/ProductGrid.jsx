import React, { useState } from 'react';
import Item from '../Item/Item';
import './ProductGrid.css';

const ProductGrid = ({ 
  products = [], 
  loading = false, 
  error = null,
  pagination = null,
  onPageChange = () => {},
  viewMode = 'grid', // 'grid' or 'list'
  onViewModeChange = () => {}
}) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const renderLoadingSkeleton = () => {
    return Array.from({ length: 12 }, (_, index) => (
      <div key={index} className="product-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
        </div>
      </div>
    ));
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
    const pages = [];
    
    // Show first page
    pages.push(1);
    
    // Show dots if there's a gap
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Show dots if there's a gap
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
          Previous
        </button>

        <div className="pagination-pages">
          {pages.map((page, index) => (
            page === '...' ? (
              <span key={index} className="pagination-dots">...</span>
            ) : (
              <button
                key={page}
                className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          className="pagination-btn next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    );
  };

  if (error) {
    return (
      <div className="product-grid-error">
        <div className="error-content">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Failed to load products</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      {/* View Mode Toggle */}
      <div className="view-controls">
        <div className="view-mode-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            title="List View"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>

        {pagination && (
          <div className="results-info">
            Showing {((pagination.currentPage - 1) * 20) + 1}-{Math.min(pagination.currentPage * 20, pagination.totalProducts)} of {pagination.totalProducts} products
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className={`product-grid ${viewMode} ${loading ? 'loading' : ''}`}>
        {loading ? (
          renderLoadingSkeleton()
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.id || index} className="product-item-wrapper">
              <Item
                id={product.id}
                name={product.name}
                image={product.image}
                new_price={product.new_price}
                old_price={product.old_price}
                isNew={product.newCollection}
                onSale={product.on_sale}
                featured={product.featured}
                stockQuantity={product.stock_quantity}
                availability={product.avilable}
                brand={product.brand}
                category={product.category}
                sizes={product.sizes || []}
                colors={product.colors || []}
                rating={product.rating}
                reviewCount={product.reviewCount}
                viewType={viewMode}
                onErrorImage={null}
              />
            </div>
          ))
        ) : (
          <div className="no-products">
            <div className="no-products-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Load More Button for Mobile */}
      {pagination && pagination.hasNextPage && (
        <div className="load-more-mobile">
          <button
            className="load-more-btn"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="60" strokeLinecap="round">
                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 0 0" to="360 0 0" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Loading...
              </>
            ) : (
              'Load More Products'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
