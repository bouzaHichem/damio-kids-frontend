// Facebook Pixel utility functions for tracking events
// Make sure to replace XXXXXXXXXXXXXXX with your actual Pixel ID in .env file

/**
 * Check if Facebook Pixel (fbq) is available
 */
const isFbqAvailable = () => {
  return typeof window !== 'undefined' && window.fbq;
};

/**
 * Track ViewContent event - when user views a product page
 * @param {Object} product - Product object
 * @param {string} product.id - Product ID
 * @param {string} product.name - Product name  
 * @param {string} product.category - Product category
 * @param {number} product.new_price - Product price
 * @param {string} currency - Currency code (default: 'DZD')
 */
export const trackViewContent = (product, currency = 'DZD') => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    window.fbq('track', 'ViewContent', {
      content_type: 'product',
      content_ids: [String(product.id)],
      content_name: product.name,
      content_category: product.category || product.categoryName,
      value: product.new_price,
      currency: currency
    });

    console.log('✅ Facebook Pixel: ViewContent tracked', {
      product_id: product.id,
      product_name: product.name,
      value: product.new_price,
      currency
    });
  } catch (error) {
    console.error('❌ Facebook Pixel ViewContent error:', error);
  }
};

/**
 * Track AddToCart event - when user adds product to cart
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity added
 * @param {Object} selectedOptions - Selected size, color, etc.
 * @param {string} currency - Currency code
 */
export const trackAddToCart = (product, quantity = 1, selectedOptions = {}, currency = 'DZD') => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    const value = product.new_price * quantity;
    
    window.fbq('track', 'AddToCart', {
      content_type: 'product',
      content_ids: [String(product.id)],
      content_name: product.name,
      content_category: product.category || product.categoryName,
      value: value,
      currency: currency,
      num_items: quantity,
      // Additional custom parameters
      product_size: selectedOptions.size,
      product_color: selectedOptions.color,
      product_age: selectedOptions.age
    });

    console.log('✅ Facebook Pixel: AddToCart tracked', {
      product_id: product.id,
      quantity,
      value,
      currency,
      selected_options: selectedOptions
    });
  } catch (error) {
    console.error('❌ Facebook Pixel AddToCart error:', error);
  }
};

/**
 * Track InitiateCheckout event - when user starts checkout process
 * @param {Array} cartItems - Array of cart items
 * @param {number} totalValue - Total cart value
 * @param {string} currency - Currency code
 */
export const trackInitiateCheckout = (cartItems = [], totalValue = 0, currency = 'DZD') => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    const contentIds = cartItems.map(item => String(item.id || item.product?.id));
    const numItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    window.fbq('track', 'InitiateCheckout', {
      content_type: 'product',
      content_ids: contentIds,
      value: totalValue,
      currency: currency,
      num_items: numItems
    });

    console.log('✅ Facebook Pixel: InitiateCheckout tracked', {
      cart_items: cartItems.length,
      total_value: totalValue,
      currency,
      num_items: numItems
    });
  } catch (error) {
    console.error('❌ Facebook Pixel InitiateCheckout error:', error);
  }
};

/**
 * Track Purchase event - when user completes an order (including COD)
 * @param {Object} orderData - Order information
 * @param {string} orderData.order_id - Order ID
 * @param {Array} orderData.items - Array of purchased items
 * @param {number} orderData.total_amount - Total order amount
 * @param {string} orderData.currency - Currency code
 * @param {Object} customerData - Customer information (optional for privacy)
 */
export const trackPurchase = (orderData, customerData = {}, currency = 'DZD') => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    const contentIds = orderData.items?.map(item => String(item.product_id || item.id)) || [];
    const numItems = orderData.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

    const eventData = {
      content_type: 'product',
      content_ids: contentIds,
      value: orderData.total_amount,
      currency: currency,
      num_items: numItems,
      // Order-specific data
      transaction_id: orderData.order_id,
      delivery_method: orderData.delivery_method || 'home_delivery',
      payment_method: orderData.payment_method || 'cash_on_delivery'
    };

    // Add customer data if provided (for better attribution)
    if (customerData.email) eventData.em = customerData.email;
    if (customerData.phone) eventData.ph = customerData.phone;

    window.fbq('track', 'Purchase', eventData);

    console.log('✅ Facebook Pixel: Purchase tracked', {
      order_id: orderData.order_id,
      total_amount: orderData.total_amount,
      currency,
      num_items: numItems,
      items: contentIds.length
    });
  } catch (error) {
    console.error('❌ Facebook Pixel Purchase error:', error);
  }
};

/**
 * Track custom events for additional insights
 * @param {string} eventName - Custom event name
 * @param {Object} parameters - Event parameters
 */
export const trackCustomEvent = (eventName, parameters = {}) => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    window.fbq('trackCustom', eventName, parameters);
    console.log(`✅ Facebook Pixel: Custom event '${eventName}' tracked`, parameters);
  } catch (error) {
    console.error(`❌ Facebook Pixel Custom event '${eventName}' error:`, error);
  }
};

/**
 * Track search events
 * @param {string} searchString - Search query
 */
export const trackSearch = (searchString) => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    window.fbq('track', 'Search', {
      search_string: searchString
    });

    console.log('✅ Facebook Pixel: Search tracked', { search_string: searchString });
  } catch (error) {
    console.error('❌ Facebook Pixel Search error:', error);
  }
};

/**
 * Track when user visits a category page
 * @param {string} category - Category name
 */
export const trackViewCategory = (category) => {
  trackCustomEvent('ViewCategory', {
    category: category,
    event_source_url: window.location.href
  });
};

/**
 * Track when user completes contact form
 * @param {string} formType - Type of form (contact, newsletter, etc.)
 */
export const trackCompleteRegistration = (formType = 'contact') => {
  if (!isFbqAvailable()) {
    console.warn('Facebook Pixel not available');
    return;
  }

  try {
    window.fbq('track', 'CompleteRegistration', {
      registration_method: formType
    });

    console.log('✅ Facebook Pixel: CompleteRegistration tracked', { method: formType });
  } catch (error) {
    console.error('❌ Facebook Pixel CompleteRegistration error:', error);
  }
};

// Export utility for debugging
export const getFacebookPixelStatus = () => {
  return {
    available: isFbqAvailable(),
    pixelId: window.REACT_APP_FACEBOOK_PIXEL_ID || 'XXXXXXXXXXXXXXX',
    version: window.fbq?.version || 'unknown'
  };
};

export default {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
  trackCustomEvent,
  trackSearch,
  trackViewCategory,
  trackCompleteRegistration,
  getFacebookPixelStatus
};