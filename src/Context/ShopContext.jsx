import React, { createContext, useEffect, useState } from "react";
import { backend_url } from "../App";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  const getDefaultCart = () => {
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    return cart;
  };

  // cartItems now stores per-product entries keyed by product id,
  // with quantity and optional variant object for the last selection.
  // Backward compatible with numbers; we normalize when reading.
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
      // Load cart from backend for logged-in users
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
        .then((data) => setCartItems(data));
    } else {
      // Load cart from localStorage for guests
      const guestCart = localStorage.getItem("guest-cart");
      if (guestCart) {
        setCartItems(JSON.parse(guestCart));
      }
    }
  }, []);

  // Save cart to localStorage if not logged in
  useEffect(() => {
    if (!localStorage.getItem("auth-token")) {
      localStorage.setItem("guest-cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const entry = cartItems[item];
      const qty = typeof entry === 'number' ? entry : (entry?.quantity || 0);
      if (qty > 0) {
        const itemInfo = products.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += qty * itemInfo.new_price;
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      const entry = cartItems[item];
      const qty = typeof entry === 'number' ? entry : (entry?.quantity || 0);
      if (qty > 0) {
        const itemInfo = products.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalItem += qty;
        }
      }
    }
    return totalItem;
  };

  const addToCart = (itemId, variant = null) => {
    setCartItems((prev) => {
      const existing = prev[itemId];
      // Normalize to object with quantity and variant
      if (typeof existing === 'number') {
        return { ...prev, [itemId]: { quantity: existing + 1, variant: variant || null } };
      }
      const nextQty = (existing?.quantity || 0) + 1;
      return { ...prev, [itemId]: { quantity: nextQty, variant: variant || existing?.variant || null } };
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
        body: JSON.stringify({ itemId, variant, quantity: 1 }),
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const existing = prev[itemId];
      if (typeof existing === 'number') {
        return { ...prev, [itemId]: Math.max(existing - 1, 0) };
      }
      const nextQty = Math.max((existing?.quantity || 0) - 1, 0);
      return { ...prev, [itemId]: { quantity: nextQty, variant: existing?.variant || null } };
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
        body: JSON.stringify({ itemId }),
      });
    }
  };

  const contextValue = {
    products,
    productsLoaded,
    getTotalCartItems,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
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
