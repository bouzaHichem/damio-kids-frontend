import { backend_url } from '../App';

/**
 * Get the correct image URL for both local development and production (Cloudinary)
 * @param {string} imagePath - The image path from the backend
 * @returns {string} - The correct full URL for the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return ''; // Return empty string for missing images
  }

  // If the path is already a full URL (Cloudinary), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's a relative path (local development), prepend backend URL
  return `${backend_url}${imagePath}`;
};

/**
 * Handle image error by setting a fallback image
 * @param {Event} event - The error event from img element
 * @param {string} fallbackImage - Optional fallback image URL
 */
export const handleImageError = (event, fallbackImage = '/default-product-image.jpg') => {
  if (event.target.src !== fallbackImage) {
    event.target.src = fallbackImage;
  }
};

/**
 * Get all image URLs from a product object
 * @param {Object} product - Product object with image and images properties
 * @returns {Array} - Array of image URLs
 */
export const getProductImages = (product) => {
  if (!product) return [];
  
  const images = [];
  
  // Add main image
  if (product.image) {
    images.push(getImageUrl(product.image));
  }
  
  // Add additional images
  if (product.images && Array.isArray(product.images)) {
    product.images.forEach(img => {
      if (img && img !== product.image) {
        images.push(getImageUrl(img));
      }
    });
  }
  
  return images.filter(Boolean); // Remove any empty/null values
};
