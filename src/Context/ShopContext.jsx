import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const STORAGE_KEY_V2 = 'guest-cart-v2';
const STORAGE_KEY_V1 = 'guest-cart';

const makeVariantKey = (id, variant) => {
  const v = variant || {};
  return [id, v?.size || '-', v?.color || '-', v?.age || '-'].join('|');
};

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const getDefaultCart = () => {
    return [];
  };

  // We now store cart as an array of line items: { id, quantity, variant }
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // Function to fetch products
  const fetchProducts = () => {
    fetch(`${backend_url}/allproducts`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setProductsLoaded(true);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setProductsLoaded(true); // Still set loaded to true even on error
      });
  };

  // Load cart and products on initial load
  useEffect(() => {
    fetchProducts();

    const authToken = localStorage.getItem("auth-token");

    if (authToken) {
      // Load cart from backend for logged-in users (optional, depends on backend capabilities)
      fetch(`${backend_url}/getcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
      })
        .then((resp) => resp.json())
        .then((data) => {
          // Expecting an array of lines; if not, try to convert
          if (Array.isArray(data)) {
            setCartItems(data);
          } else if (data && typeof data === 'object') {
            const lines = Object.keys(data).flatMap((pid) => {
              const entry = data[pid];
              if (typeof entry === 'number') {
                return [{ id: Number(pid), quantity: entry, variant: null }];
              }
              if (entry && typeof entry === 'object') {
                const qty = Number(entry.quantity || 0);
                const v = entry.variant || null;
                if (qty > 0) return [{ id: Number(pid), quantity: qty, variant: v }];
              }
              return [];
            });
            setCartItems(lines);
          }
        });
    } else {
      // Load cart from localStorage for guests
      const v2 = localStorage.getItem(STORAGE_KEY_V2);
      if (v2) {
        try {
          const parsed = JSON.parse(v2);
          if (Array.isArray(parsed)) setCartItems(parsed);
        } catch {}
      } else {
        const legacy = localStorage.getItem(STORAGE_KEY_V1);
        if (legacy) {
          try {
            const obj = JSON.parse(legacy);
            const lines = Object.keys(obj).flatMap((pid) => {
              const entry = obj[pid];
              if (typeof entry === 'number') return [{ id: Number(pid), quantity: entry, variant: null }];
              if (entry && typeof entry === 'object') {
                const qty = Number(entry.quantity || 0);
                if (qty > 0) return [{ id: Number(pid), quantity: qty, variant: entry.variant || null }];
              }
              return [];
            });
            setCartItems(lines);
          } catch {}
        }
      }
    }
  }, []);

  // Save cart to localStorage if not logged in (v2 format)
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const getTotalCartAmount = () => {
    if (!Array.isArray(cartItems)) return 0;
    let totalAmount = 0;
    for (const line of cartItems) {
      const itemInfo = products.find((product) => product.id === Number(line.id));
      if (itemInfo) {
        totalAmount += Number(line.quantity || 0) * Number(itemInfo.new_price || 0);
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, line) => sum + Number(line.quantity || 0), 0);
  };

  const addToCart = (itemId, variant = null, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) => {
      const lines = Array.isArray(prev) ? [...prev] : [];
      const key = makeVariantKey(itemId, variant);
      const idx = lines.findIndex(l => makeVariantKey(l.id, l.variant) === key);
      if (idx >= 0) {
        lines[idx] = { ...lines[idx], quantity: Number(lines[idx].quantity || 0) + qty };
      } else {
        lines.push({ id: itemId, quantity: qty, variant: variant || null });
      }
      return lines;
    });

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${backend_url}/addtocart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, variant, quantity: qty }),
      });
    }
  };

  const removeFromCart = (itemId, variant = null, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCartItems((prev) => {
      const lines = Array.isArray(prev) ? [...prev] : [];
      const key = makeVariantKey(itemId, variant);
      const idx = lines.findIndex(l => makeVariantKey(l.id, l.variant) === key);
      if (idx >= 0) {
        const nextQty = Math.max(0, Number(lines[idx].quantity || 0) - qty);
        if (nextQty === 0) {
          lines.splice(idx, 1);
        } else {
          lines[idx] = { ...lines[idx], quantity: nextQty };
        }
      }
      return lines;
    });

    const authToken = localStorage.getItem("auth-token");
    if (authToken) {
      fetch(`${backend_url}/removefromcart`, {
        method: 'POST',
        headers: {
          Accept: 'application/form-data',
          'auth-token': authToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, variant, quantity: qty }),
      });
    }
  };

  const removeLine = (itemId, variant = null) => {
    setCartItems((prev) => {
      const lines = Array.isArray(prev) ? [...prev] : [];
      const key = makeVariantKey(itemId, variant);
      return lines.filter(l => makeVariantKey(l.id, l.variant) !== key);
    });
  };

  const getCartLines = () => Array.isArray(cartItems) ? cartItems : [];

  const clearCart = () => setCartItems([]);

  const contextValue = {
    products,
    productsLoaded,
    getTotalCartItems,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    removeLine,
    clearCart,
    getCartLines,
    getTotalCartAmount,
    getDefaultCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
