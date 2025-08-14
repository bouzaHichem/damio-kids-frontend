import React, { useContext, useRef, useState, useEffect } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import logo from '../Assets/ltogod.JPG'
import cart_icon from '../Assets/cart_icon.png'
import { ShopContext } from '../../Context/ShopContext'
import { backend_url } from '../../App'
import nav_dropdown from '../Assets/nav_dropdown.png'

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();
  const dropdownTimeoutRef = useRef(null);

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
    e.target.classList.toggle('open');
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

  if (loading) {
    return (
      <div className='nav'>
        <Link to='/' className="nav-logo">
          <img src={logo} alt="logo" />
        </Link>
        <div className="nav-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className='nav'>
      <Link to='/' onClick={() => { setMenu("shop"); closeMobileMenu() }} className="nav-logo">
        <img src={logo} alt="logo" />
      </Link>

      {/* Mobile toggle */}
      <img 
        onClick={dropdown_toggle} 
        className='nav-dropdown' 
        src={nav_dropdown} 
        alt="menu" 
      />

      <ul ref={menuRef} className="nav-menu">
        {/* Shop Link */}
        <li 
          className="nav-menu-item" 
          onClick={() => { setMenu("shop"); closeMobileMenu() }}
        >
          <Link to='/' className="nav-link">
            Shop
          </Link>
          {menu === "shop" && <hr className="nav-underline" />}
        </li>

        {/* All Products Link */}
        <li 
          className="nav-menu-item" 
          onClick={() => { setMenu("products"); closeMobileMenu() }}
        >
          <Link to='/products' className="nav-link">
            All Products
          </Link>
          {menu === "products" && <hr className="nav-underline" />}
        </li>

        {/* Dynamic Categories */}
        {categories.map((category) => (
          <li
            key={category.id}
            className="nav-menu-item nav-item-with-dropdown"
            onMouseEnter={() => handleMouseEnter(category.name.toLowerCase())}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleMobileClick(category.name.toLowerCase())}
          >
            <Link
              to={`/${category.name.toLowerCase()}`}
              className="nav-link"
              onClick={(e) => {
                if (window.innerWidth <= 768 && category.subcategories?.length > 0) {
                  e.preventDefault();
                }
              }}
            >
              {category.name}
              {category.subcategories?.length > 0 && (
                <span className="dropdown-arrow">
                  {activeDropdown === category.name.toLowerCase() ? '▲' : '▼'}
                </span>
              )}
            </Link>
            {menu === category.name.toLowerCase() && <hr className="nav-underline" />}

            {/* Dropdown */}
            {category.subcategories?.length > 0 && (
              <div
                className={`
                  nav-dropdown-menu
                  ${activeDropdown === category.name.toLowerCase() ? 'show' : ''}
                `}
              >
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/${category.name.toLowerCase()}/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="nav-dropdown-item"
                    onClick={closeMobileMenu}
                  >
                    <span className="subcategory-dot"></span>
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Cart & Login */}
      <div className="nav-login-cart">
        {localStorage.getItem('auth-token') ? (
          <button 
            onClick={() => {
              localStorage.removeItem('auth-token');
              window.location.replace("/");
            }}
            className="nav-logout-btn"
          >
            Logout
          </button>
        ) : (
          <Link to='/login'>
            <button className="nav-login-btn">Login</button>
          </Link>
        )}

        <Link to="/cart" className="nav-cart-link">
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
