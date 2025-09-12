// Internationalization (i18n) Service for Multi-language Support

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Supported languages
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
};

// Translation keys and default values (English)
export const DEFAULT_TRANSLATIONS = {
  // Navigation
'nav.home': 'Home',
  'nav.shop': 'Shop',
  'nav.all_products': 'All Products',
  'nav.products': 'Products',
  'nav.categories': 'Categories',
  'nav.about': 'About Us',
  'nav.contact': 'Contact',
  'nav.cart': 'Cart',
  'nav.account': 'My Account',
  'nav.orders': 'My Orders',
  'nav.wishlist': 'Wishlist',
  'nav.search': 'Search',
  
  // Common actions
  'action.add_to_cart': 'Add to Cart',
  'action.buy_now': 'Buy Now',
  'action.view_details': 'View Details',
  'action.save': 'Save',
  'action.cancel': 'Cancel',
  'action.delete': 'Delete',
  'action.edit': 'Edit',
  'action.update': 'Update',
  'action.confirm': 'Confirm',
  'action.continue': 'Continue',
  'action.back': 'Back',
  'action.next': 'Next',
  'action.previous': 'Previous',
  'action.submit': 'Submit',
  'action.close': 'Close',
  'action.apply': 'Apply',
  'action.clear': 'Clear',
  'action.retry': 'Retry',
  'action.refresh': 'Refresh',
  
  // Product related
  'product.price': 'Price',
  'product.size': 'Size',
  'product.color': 'Color',
  'product.quantity': 'Quantity',
  'product.in_stock': 'In Stock',
  'product.out_of_stock': 'Out of Stock',
  'product.low_stock': 'Low Stock',
  'product.description': 'Description',
  'product.specifications': 'Specifications',
  'product.reviews': 'Reviews',
  'product.rating': 'Rating',
  'product.category': 'Category',
  'product.brand': 'Brand',
  'product.sku': 'SKU',
  'product.availability': 'Availability',
  'product.shipping': 'Shipping',
  'product.return_policy': 'Return Policy',
  
  // Categories
  'category.boys': 'Boys',
  'category.girls': 'Girls',
  'category.babies': 'Babies',
  'category.toddlers': 'Toddlers',
  'category.clothing': 'Clothing',
  'category.shoes': 'Shoes',
  'category.accessories': 'Accessories',
  'category.toys': 'Toys',
  'category.school_supplies': 'School Supplies',
  'category.sports': 'Sports',
  
  // Shopping cart
  'cart.title': 'Shopping Cart',
  'cart.empty': 'Your cart is empty',
  'cart.total': 'Total',
  'cart.subtotal': 'Subtotal',
  'cart.shipping': 'Shipping',
  'cart.tax': 'Tax',
  'cart.discount': 'Discount',
  'cart.checkout': 'Checkout',
  'cart.continue_shopping': 'Continue Shopping',
  'cart.remove_item': 'Remove Item',
  'cart.update_quantity': 'Update Quantity',
  
  // Checkout
  'checkout.title': 'Checkout',
  'checkout.shipping_address': 'Shipping Address',
  'checkout.billing_address': 'Billing Address',
  'checkout.payment_method': 'Payment Method',
  'checkout.order_summary': 'Order Summary',
  'checkout.place_order': 'Place Order',
  'checkout.processing': 'Processing...',
  
  // User account
  'account.login': 'Login',
  'account.register': 'Register',
  'account.logout': 'Logout',
  'account.profile': 'Profile',
  'account.email': 'Email',
  'account.password': 'Password',
  'account.confirm_password': 'Confirm Password',
  'account.first_name': 'First Name',
  'account.last_name': 'Last Name',
  'account.phone': 'Phone',
  'account.address': 'Address',
  'account.city': 'City',
  'account.state': 'State',
  'account.postal_code': 'Postal Code',
  'account.country': 'Country',
  
  // Orders
  'order.number': 'Order Number',
  'order.date': 'Order Date',
  'order.status': 'Status',
  'order.total': 'Total',
  'order.items': 'Items',
  'order.tracking': 'Tracking',
  'order.details': 'Order Details',
  'order.history': 'Order History',
  
  // Status messages
  'status.pending': 'Pending',
  'status.processing': 'Processing',
  'status.shipped': 'Shipped',
  'status.delivered': 'Delivered',
  'status.cancelled': 'Cancelled',
  'status.refunded': 'Refunded',
  
  // Error messages
  'error.general': 'An error occurred. Please try again.',
  'error.network': 'Network error. Please check your connection.',
  'error.not_found': 'Item not found.',
  'error.unauthorized': 'Please login to continue.',
  'error.invalid_input': 'Please check your input.',
  'error.server': 'Server error. Please try again later.',
  
  // Success messages
  'success.added_to_cart': 'Item added to cart',
  'success.profile_updated': 'Profile updated successfully',
  'success.order_placed': 'Order placed successfully',
  'success.email_sent': 'Email sent successfully',
  
  // Loading messages
'loading.generic': 'Loading...',
  'loading.products': 'Loading products...',
  'loading.cart': 'Loading cart...',
  'loading.checkout': 'Processing checkout...',
  'loading.profile': 'Loading profile...',
  
  // Search and filters
  'search.placeholder': 'Search products...',
  'search.no_results': 'No products found',
  'search.results_count': '{count} results found',
  'filter.price_range': 'Price Range',
  'filter.brand': 'Brand',
  'filter.size': 'Size',
  'filter.color': 'Color',
  'filter.rating': 'Rating',
  'filter.availability': 'Availability',
  'filter.clear_all': 'Clear All Filters',
  'filter.apply': 'Apply Filters',
  
  // Footer
  'footer.about_us': 'About Us',
  'footer.customer_service': 'Customer Service',
  'footer.shipping_info': 'Shipping Information',
  'footer.return_policy': 'Return Policy',
  'footer.size_guide': 'Size Guide',
  'footer.contact_us': 'Contact Us',
  'footer.follow_us': 'Follow Us',
  'footer.newsletter': 'Newsletter',
  'footer.subscribe': 'Subscribe',
  'footer.privacy_policy': 'Privacy Policy',
  'footer.terms_of_service': 'Terms of Service',
  'footer.copyright': '© {year} Damio Kids. All rights reserved.',
  
  // PWA
  'pwa.install': 'Install App',
  'pwa.update_available': 'Update Available',
  'pwa.offline': 'You are offline',
  'pwa.online': 'You are back online',
  'pwa.install_prompt': 'Add Damio Kids to your home screen for a better experience',
  
// Home
  'home.shop_by_category': 'Shop by Category',
  'home.shop_all': 'Shop all',
  'home.trending': 'Trending',
  'home.new_in': 'New in',
  'home.bestsellers': 'Bestsellers',
  'home.eco_fabrics': 'Eco fabrics',
'home.view_all_new': 'View All New Products',

  // All products page
  'all_products.title': 'All Products',
  'all_products.tagline': 'Discover our complete collection',

  // Category / counts
  'category.showing_count': 'Showing {count} products',

  // Actions
  'action.explore_more': 'Explore More',
 
  // Miscellaneous
  'misc.currency': '$',
  'misc.support': 'Support',
  'misc.and': 'and',
  'misc.or': 'or',
  'misc.yes': 'Yes',
  'misc.no': 'No',
  'misc.more': 'More',
  'misc.less': 'Less',
  'misc.show_more': 'Show More',
  'misc.show_less': 'Show Less',
  'misc.featured': 'Featured',
  'misc.new_arrival': 'New Arrival',
  'misc.sale': 'Sale',
  'misc.best_seller': 'Best Seller'
};

// Translation loader class
class TranslationLoader {
  constructor() {
    this.translations = {
      // Always keep English defaults available for fallback
      en: DEFAULT_TRANSLATIONS
    };
    // Do NOT mark any language as pre-loaded so we fetch even for 'en'
    this.loadedLanguages = new Set();
    this.loadingPromises = new Map();
  }
  
  async loadLanguage(languageCode) {
    if (this.loadedLanguages.has(languageCode)) {
      return this.translations[languageCode];
    }
    
    // Prevent multiple concurrent loads of the same language
    if (this.loadingPromises.has(languageCode)) {
      return await this.loadingPromises.get(languageCode);
    }
    
    const loadPromise = this._loadTranslationFile(languageCode);
    this.loadingPromises.set(languageCode, loadPromise);
    
    try {
      const fileTranslations = await loadPromise;
      // Merge the loaded file with English defaults so missing keys still work
      const merged = { ...DEFAULT_TRANSLATIONS, ...(fileTranslations || {}) };
      this.translations[languageCode] = merged;
      this.loadedLanguages.add(languageCode);
      return merged;
    } catch (error) {
      console.error(`Failed to load translations for ${languageCode}:`, error);
      // Fallback to English
      return this.translations.en;
    } finally {
      this.loadingPromises.delete(languageCode);
    }
  }
  
  async _loadTranslationFile(languageCode) {
    try {
      // Load from public folder at runtime
      const response = await fetch(`/locales/${languageCode}.json`, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
      // If not found, fall through to fallback
      return await this._generateBasicTranslations(languageCode);
    } catch (error) {
      // If no translation file exists, generate basic translations
      return await this._generateBasicTranslations(languageCode);
    }
  }
  
  async _generateBasicTranslations(languageCode) {
    // This could integrate with translation APIs like Google Translate
    // For now, return English as fallback
    console.warn(`No translations found for ${languageCode}, using English fallback`);
    return DEFAULT_TRANSLATIONS;
  }
  
  getTranslation(languageCode, key, params = {}) {
    // Prefer current language, then fall back to English defaults, then the key
    const langTranslations = this.translations[languageCode] || {};
    let translation = langTranslations[key] ?? DEFAULT_TRANSLATIONS[key] ?? key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(param => {
      translation = String(translation).replace(`{${param}}`, params[param]);
    });
    
    return translation;
  }
}

// Create translation loader instance
const translationLoader = new TranslationLoader();

// i18n context
const I18nContext = createContext();

// i18n reducer
const i18nReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLanguage: action.payload,
        direction: SUPPORTED_LANGUAGES[action.payload]?.direction || 'ltr'
      };
    case 'SET_TRANSLATIONS':
      return {
        ...state,
        translations: {
          ...state.translations,
          [action.language]: action.payload
        }
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Detect user's preferred language
const detectLanguage = () => {
  // Check localStorage
  const stored = localStorage.getItem('damio-language');
  if (stored && SUPPORTED_LANGUAGES[stored]) {
    return stored;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang;
  }
  
  // Default to English
  return 'en';
};

// I18n Provider component
export const I18nProvider = ({ children }) => {
  const [state, dispatch] = useReducer(i18nReducer, {
    currentLanguage: detectLanguage(),
    translations: { en: DEFAULT_TRANSLATIONS },
    loading: false,
    direction: SUPPORTED_LANGUAGES[detectLanguage()]?.direction || 'ltr'
  });
  
useEffect(() => {
    // Apply direction to document
    document.dir = state.direction;
    document.documentElement.lang = state.currentLanguage;
  }, [state.direction, state.currentLanguage]);

  // Load translations for the initial language on mount
  useEffect(() => {
    // Fire and forget; internal state updates will re-render
    changeLanguage(state.currentLanguage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const changeLanguage = async (languageCode) => {
    if (!SUPPORTED_LANGUAGES[languageCode]) {
      console.error(`Unsupported language: ${languageCode}`);
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const translations = await translationLoader.loadLanguage(languageCode);
      
      dispatch({
        type: 'SET_TRANSLATIONS',
        language: languageCode,
        payload: translations
      });
      
      dispatch({ type: 'SET_LANGUAGE', payload: languageCode });
      
      // Store preference
      localStorage.setItem('damio-language', languageCode);
      
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  
  const translate = (key, params = {}) => {
    return translationLoader.getTranslation(state.currentLanguage, key, params);
  };
  
  const value = {
    ...state,
    changeLanguage,
    translate,
    t: translate, // Short alias
    supportedLanguages: SUPPORTED_LANGUAGES
  };
  
  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Higher-order component for class components
export const withI18n = (Component) => {
  return function WrappedComponent(props) {
    const i18n = useI18n();
    return <Component {...props} i18n={i18n} />;
  };
};

// Translation component for inline translations
export const Trans = ({ i18nKey, params = {}, children }) => {
  const { translate } = useI18n();
  
  if (children && typeof children === 'string') {
    // Use children as fallback if key not found
    const translation = translate(i18nKey, params);
    return translation === i18nKey ? children : translation;
  }
  
  return translate(i18nKey, params);
};

// Language switcher component
export const LanguageSwitcher = ({ className = '', showNativeName = true }) => {
  const { currentLanguage, changeLanguage, supportedLanguages, loading } = useI18n();
  
  return (
    <select
      className={`language-switcher ${className}`}
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      disabled={loading}
    >
      {Object.entries(supportedLanguages).map(([code, lang]) => (
        <option key={code} value={code}>
          {showNativeName ? lang.nativeName : lang.name}
        </option>
      ))}
    </select>
  );
};

// Number and currency formatting
export const useNumberFormat = () => {
  const { currentLanguage } = useI18n();
  
  const formatNumber = (number, options = {}) => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  };
  
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  const formatPercent = (value) => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'percent'
    }).format(value);
  };
  
  return {
    formatNumber,
    formatCurrency,
    formatPercent
  };
};

// Date formatting
export const useDateFormat = () => {
  const { currentLanguage } = useI18n();
  
  const formatDate = (date, options = {}) => {
    return new Intl.DateTimeFormat(currentLanguage, options).format(new Date(date));
  };
  
  const formatRelativeTime = (date) => {
    const rtf = new Intl.RelativeTimeFormat(currentLanguage, { numeric: 'auto' });
    const now = new Date();
    const target = new Date(date);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (Math.abs(diffDays) < 1) {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      if (Math.abs(diffHours) < 1) {
        const diffMinutes = Math.ceil(diffTime / (1000 * 60));
        return rtf.format(diffMinutes, 'minute');
      }
      return rtf.format(diffHours, 'hour');
    }
    
    return rtf.format(diffDays, 'day');
  };
  
  return {
    formatDate,
    formatRelativeTime
  };
};

export default {
  I18nProvider,
  useI18n,
  withI18n,
  Trans,
  LanguageSwitcher,
  useNumberFormat,
  useDateFormat,
  SUPPORTED_LANGUAGES,
  DEFAULT_TRANSLATIONS
};
