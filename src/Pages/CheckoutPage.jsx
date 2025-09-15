import React, { useContext, useState, useEffect } from "react";
import "./CSS/checkout.css";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backend_url } from "../App";
import { useI18n } from "../utils/i18n";

const CheckoutPage = () => {
  const { t } = useI18n();
  const { cartItems, products, getTotalCartAmount, setCartItems, getDefaultCart } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    wilaya: "",
    commune: "",
    adresse: "",
    telephone: "",
    notes: "",
    deliveryMethod: "home" // home or pickup
  });

  // State for wilayas and delivery
  const [wilayas, setWilayas] = useState([]);
  const [availableCommunes, setAvailableCommunes] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const navigate = useNavigate();
  const totalAmount = getTotalCartAmount();
  const finalTotal = totalAmount + deliveryFee;

  // Fetch wilayas on component mount
  useEffect(() => {
    fetchWilayas();
  }, []);

  // Update available communes when wilaya changes
  useEffect(() => {
    if (form.wilaya) {
      updateAvailableCommunes(form.wilaya);
      // Reset commune and delivery fee when wilaya changes
      setForm(prev => ({ ...prev, commune: "" }));
      setDeliveryFee(0);
    } else {
      setAvailableCommunes([]);
      setDeliveryFee(0);
    }
  }, [form.wilaya]);

  // Calculate delivery fee when commune or delivery method changes
  useEffect(() => {
    if (form.wilaya && form.commune && form.deliveryMethod) {
      calculateDeliveryFee();
    } else {
      setDeliveryFee(0);
    }
  }, [form.wilaya, form.commune, form.deliveryMethod]);

  const fetchWilayas = async () => {
    try {
      const response = await fetch(`${backend_url}/wilayas`);
      if (response.ok) {
        const data = await response.json();
        setWilayas(data);
      } else {
        console.error('Failed to fetch wilayas');
      }
    } catch (error) {
      console.error('Error fetching wilayas:', error);
    }
  };

  const updateAvailableCommunes = (selectedWilaya) => {
    const wilaya = wilayas.find(w => w.name === selectedWilaya);
    if (wilaya) {
      setAvailableCommunes(wilaya.communes);
    } else {
      setAvailableCommunes([]);
    }
  };

  const calculateDeliveryFee = async () => {
    try {
      setDeliveryLoading(true);
      const response = await fetch(`${backend_url}/deliveryfee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wilaya: form.wilaya,
          commune: form.commune,
          deliveryType: form.deliveryMethod
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDeliveryFee(data.fee);
      } else {
        setDeliveryFee(0);
        toast.warning('Frais de livraison non disponible pour cette zone');
      }
    } catch (error) {
      console.error('Error calculating delivery fee:', error);
      setDeliveryFee(0);
    } finally {
      setDeliveryLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!form.prenom || !form.nom || !form.adresse || !form.telephone) {
      toast.error("Veuillez remplir les champs obligatoires.");
      return;
    }

    // Convert cartItems object to array format expected by backend, including variant
    const orderItems = [];
    for (const itemId in cartItems) {
      const entry = cartItems[itemId];
      const qty = typeof entry === 'number' ? entry : (entry?.quantity || 0);
      if (qty > 0) {
        const product = products.find(p => p.id === Number(itemId));
        if (product) {
          orderItems.push({
            id: product.id,
            name: product.name,
            quantity: qty,
            price: product.new_price,
            image: product.image,
            variant: typeof entry === 'number' ? null : (entry?.variant || null)
          });
        }
      }
    }

    const authToken = localStorage.getItem("auth-token");
    const userId = authToken ? 'logged-user' : 'guest';
    
    const order = {
      items: orderItems,
      total: finalTotal,
      deliveryFee: deliveryFee,
      wilaya: form.wilaya,
      commune: form.commune,
      deliveryType: form.deliveryMethod,
      address: `${form.prenom} ${form.nom}, ${form.adresse}, ${form.commune}, ${form.wilaya}. Tel: ${form.telephone}. Notes: ${form.notes}`,
      userId: userId
    };

    try {
      setLoading(true);
      const res = await fetch(`${backend_url}/placeorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Commande envoyée avec succès !");
        setCartItems(getDefaultCart());
        // Clear guest cart from localStorage
        localStorage.removeItem("guest-cart");
        navigate("/OrderConfirmation");
      } else {
        toast.error(data?.error || "Erreur lors de l'envoi de la commande.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {/* Left - Billing Form */}
      <div className="checkout-section">
        <h2>{t('checkout.billing_shipping')}</h2>
        <div className="checkout-form">
          <input name="prenom" onChange={handleChange} placeholder={t('checkout.first_name_placeholder')} required />
          <input name="nom" onChange={handleChange} placeholder={t('checkout.last_name_placeholder')} required />
          <select name="wilaya" value={form.wilaya} onChange={handleChange} required>
            <option value="">{t('checkout.select_wilaya_placeholder')}</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya._id} value={wilaya.name}>
                {wilaya.name}
              </option>
            ))}
          </select>
          <select name="commune" value={form.commune} onChange={handleChange} required disabled={!form.wilaya}>
            <option value="">{t('checkout.select_commune_placeholder')}</option>
            {availableCommunes.map((commune, index) => (
              <option key={index} value={commune}>
                {commune}
              </option>
            ))}
          </select>
          <input name="adresse" onChange={handleChange} placeholder={t('checkout.address_placeholder')} required />
          <input name="telephone" onChange={handleChange} placeholder={t('checkout.phone_placeholder')} required />
          
          <div className="delivery-method-section">
            <h3>{t('checkout.delivery_method')}</h3>
            <div className="delivery-method-options">
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="home"
                  checked={form.deliveryMethod === "home"}
                  onChange={handleChange}
                />
                <span>{t('checkout.delivery_home')}</span>
              </label>
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={form.deliveryMethod === "pickup"}
                  onChange={handleChange}
                />
                <span>{t('checkout.delivery_pickup')}</span>
              </label>
            </div>
          </div>
        </div>

        <h2>{t('checkout.additional_info')}</h2>
        <textarea
          name="notes"
          placeholder={t('checkout.notes_placeholder')}
          onChange={handleChange}
        />
      </div>

      {/* Right - Order Summary */}
      <div className="checkout-order-summary">
        <h3 className="order-section-title">{t('checkout.your_order')}</h3>

        {products.map((product) => {
          const quantity = cartItems[product.id];
          if (quantity > 0) {
            return (
              <div key={product.id} className="order-item">
                <span>{product.name} × {quantity}</span>
                <span>{(product.new_price * quantity).toFixed(2)} د.ج</span>
              </div>
            );
          }
          return null;
        })}

        <div className="order-subtotal">
          <span>{t('checkout.subtotal_products')}</span>
          <span>{totalAmount.toFixed(2)} د.ج</span>
        </div>
        <div className="order-shipping">
          <span>{t('checkout.shipping_fee')}</span>
          <span>
            {deliveryLoading ? t('checkout.calculating') : 
             deliveryFee > 0 ? `${deliveryFee.toFixed(2)} د.ج` : 
             form.wilaya && form.commune ? t('cart.shipping_free') : t('checkout.to_calculate')}
          </span>
        </div>
        <div className="order-total">
          <span><strong>{t('cart.total')}</strong></span>
          <span><strong>{finalTotal.toFixed(2)} د.ج</strong></span>
        </div>

        <div className="checkout-note">
          <strong>{t('checkout.payment_method_title')}</strong><br />
          {t('checkout.cod_title')}<br />
          {t('checkout.cod_desc')}<br /><br />
          {t('checkout.privacy_notice')}
        </div>

        <button
          className="checkout-button"
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? t('checkout.sending') : t('checkout.place_order')}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
