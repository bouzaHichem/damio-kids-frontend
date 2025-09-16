import React, { useContext, useRef, useState, useEffect } from 'react'
import './Navbar.css'
import { Link, useLocation } from 'react-router-dom'
import logo from '../Assets/ltogod.JPG'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import { backend_url } from '../../App'
import nav_dropdown from '../Assets/nav_dropdown.png'
import { LanguageSwitcher, useI18n } from '../../utils/i18n'

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { t } = useI18n();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const dropdownTimeoutRef = useRef(null);
  const location = useLocation();

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${backend_url}/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
          setError(null);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to connect to server');
        // Fallback demo data
        setCategories([
          {
            id: 1,
            name: 'Garçon',
            subcategories: [
              { id: 1, name: 'T-Shirts' },
              { id: 2, name: 'Pantalons' },
              { id: 3, name: 'Vestes' },
              { id: 4, name: 'Chaussures' }
            ]
          },
          {
            id: 2,
            name: 'Fille',
            subcategories: [
              { id: 1, name: 'Robes' },
              { id: 2, name: 'Tops' },
              { id: 3, name: 'Jupes' },
              { id: 4, name: 'Chaussures' }
            ]
          },
          {
            id: 3,
            name: 'Bébé',
            subcategories: [
              { id: 1, name: 'Bodies' },
              { id: 2, name: 'Pyjamas' },
              { id: 3, name: 'Chaussures' },
              { id: 4, name: 'Jouets' }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Mobile menu toggle
  const dropdown_toggle = (e) => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    menuRef.current.classList.toggle('nav-menu-visible');
    // Ensure we toggle the class on the button itself, not on inner SVG nodes
    e.currentTarget.classList.toggle('open');
  }

  // Desktop hover handlers
  const handleMouseEnter = (categoryName) => {
    if (window.innerWidth > 768) {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
      setActiveDropdown(categoryName);
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      dropdownTimeoutRef.current = setTimeout(() => {
        setActiveDropdown(null);
      }, 150);
    }
  }

  // Mobile click toggle for dropdown
  const handleMobileClick = (categoryName) => {
    if (window.innerWidth <= 768) {
      setActiveDropdown(activeDropdown === categoryName ? null : categoryName);
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    menuRef.current.classList.remove('nav-menu-visible');
  }

  // Cleanup
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  // Close mobile menu automatically on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className='nav'>
        <Link to='/' className="nav-logo">
          <img src={logo} alt="logo" />
        </Link>
        <div className="nav-loading">{t('loading.generic')}</div>
      </div>
    );
  }

  // Helpers to create consistent slugs for category URLs and keys
  const slugify = (str = '') =>
    (str || '')
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const normalizeKey = (name = '') => slugify(name);
  const toRouteSegment = (name = '') => slugify(name);

  return (
    <div className='nav'>
      <Link to='/' onClick={() => { setMenu("shop"); closeMobileMenu() }} className="nav-logo">
        <img src={logo} alt="logo" />
      </Link>

      {/* Mobile center: category/menu toggle (icon) */}
      <button
        type="button"
        className="icon-btn nav-mobile-center"
        aria-label="Browse categories"
        title="Browse"
        onClick={dropdown_toggle}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="2"></rect>
          <rect x="14" y="3" width="7" height="7" rx="2"></rect>
          <rect x="3" y="14" width="7" height="7" rx="2"></rect>
          <rect x="14" y="14" width="7" height="7" rx="2"></rect>
        </svg>
      </button>

      <ul ref={menuRef} className="nav-menu">
        {/* Shop Link */}
        <li 
          className="nav-menu-item" 
          onClick={() => { setMenu("shop"); closeMobileMenu() }}
        >
          <Link to='/' className="nav-link">
            {t('nav.shop')}
          </Link>
          {location.pathname === '/' && <hr className="nav-underline" />}
        </li>

        {/* All Products Link */}
        <li 
          className="nav-menu-item" 
          onClick={() => { setMenu("products"); closeMobileMenu() }}
        >
          <Link to='/products' className="nav-link">
            {t('nav.all_products')}
          </Link>
          {(location.pathname === '/products' || location.pathname.startsWith('/products/')) && <hr className="nav-underline" />}
        </li>

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <li
            key={category.id}
            className="nav-menu-item nav-item-with-dropdown"
            onMouseEnter={() => handleMouseEnter(normalizeKey(category.name))}
            onMouseLeave={handleMouseLeave}
          >
            <div className="nav-item-row">
              <Link
                to={`/${toRouteSegment(category.name)}`}
                className="nav-link"
                onClick={closeMobileMenu}
              >
                {category.name}
              </Link>
              {category.subcategories?.length > 0 && (
                <button
                  type="button"
                  className="submenu-toggle"
                  aria-expanded={activeDropdown === normalizeKey(category.name)}
                  aria-controls={`submenu-${category.id || toRouteSegment(category.name)}`}
                  aria-label={`${activeDropdown === normalizeKey(category.name) ? 'Collapse' : 'Expand'} ${category.name} subcategories`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleMobileClick(normalizeKey(category.name));
                  }}
                >
                  <span className="dropdown-arrow">
                    {activeDropdown === normalizeKey(category.name) ? '▲' : '▼'}
                  </span>
                </button>
              )}
            </div>
{(location.pathname === `/${toRouteSegment(category.name)}` || location.pathname.startsWith(`/${toRouteSegment(category.name)}/`)) && <hr className="nav-underline" />}

            {/* Dropdown */}
            {category.subcategories?.length > 0 && (
              <div
                id={`submenu-${category.id || toRouteSegment(category.name)}`}
                className={`
                  nav-dropdown-menu
                  ${activeDropdown === normalizeKey(category.name) ? 'show' : ''}
                `}
              >
                {category.subcategories.map((subcategory) => {
                  const subSlug = subcategory.name.toLowerCase().replace(/\s+/g, '-');
                  const subPath = `/${toRouteSegment(category.name)}/${subSlug}`;
                  const isActiveSub = location.pathname === subPath || location.pathname.startsWith(`${subPath}/`);
                  return (
                    <Link
                      key={subcategory.id}
                      to={subPath}
                      className={`nav-dropdown-item ${isActiveSub ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="subcategory-dot"></span>
                      {subcategory.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Cart & Login */}
      <div className="nav-login-cart">
        <LanguageSwitcher className="nav-lang-switch" />

        {/* Icon-only profile for mobile */}
        <Link to='/login' className="nav-icon-btn profile" aria-label={t('nav.account')} title={t('nav.account')}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"></path>
            <path d="M2 21c0-4.418 3.582-8 8-8h4c4.418 0 8 3.582 8 8"></path>
          </svg>
        </Link>

        {/* Text buttons for desktop */}
        {localStorage.getItem('auth-token') ? (
          <button 
            onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.replace('/');
            }}
            className="nav-logout-btn"
          >
            {t('account.logout')}
          </button>
        ) : (
          <Link to='/login'>
            <button className="nav-login-btn">{t('account.login')}</button>
          </Link>
        )}

        <Link to="/cart" className="nav-cart-link" aria-label={t('nav.cart')} title={t('nav.cart')}>
          <img src={cart_icon} alt="cart" className="nav-cart-icon" />
          {getTotalCartItems() > 0 && (
            <div className="nav-cart-count">{getTotalCartItems()}</div>
          )}
        </Link>
      </div>

      {error && <div className="nav-error-display">⚠️ {error}</div>}
    </div>
  );
}

export default Navbar
