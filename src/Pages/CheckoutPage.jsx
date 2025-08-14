import React, { useContext, useState, useEffect } from "react";
import "./CSS/checkout.css";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backend_url } from "../App";

const CheckoutPage = () => {
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

    // Convert cartItems object to array format expected by backend
    const orderItems = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = products.find(p => p.id === Number(itemId));
        if (product) {
          orderItems.push({
            id: product.id,
            name: product.name,
            quantity: cartItems[itemId],
            price: product.new_price,
            image: product.image
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
        <h2>Facturation & Expédition</h2>
        <div className="checkout-form">
          <input name="prenom" onChange={handleChange} placeholder="Prénom *" required />
          <input name="nom" onChange={handleChange} placeholder="Nom *" required />
          <select name="wilaya" value={form.wilaya} onChange={handleChange} required>
            <option value="">Sélectionnez une wilaya *</option>
            {wilayas.map((wilaya) => (
              <option key={wilaya._id} value={wilaya.name}>
                {wilaya.name}
              </option>
            ))}
          </select>
          <select name="commune" value={form.commune} onChange={handleChange} required disabled={!form.wilaya}>
            <option value="">Sélectionnez une commune *</option>
            {availableCommunes.map((commune, index) => (
              <option key={index} value={commune}>
                {commune}
              </option>
            ))}
          </select>
          <input name="adresse" onChange={handleChange} placeholder="Adresse *" required />
          <input name="telephone" onChange={handleChange} placeholder="Téléphone *" required />
          
          <div className="delivery-method-section">
            <h3>Méthode de livraison</h3>
            <div className="delivery-method-options">
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="home"
                  checked={form.deliveryMethod === "home"}
                  onChange={handleChange}
                />
                <span>Livraison à domicile</span>
              </label>
              <label className="delivery-option">
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={form.deliveryMethod === "pickup"}
                  onChange={handleChange}
                />
                <span>Retrait au point de collecte</span>
              </label>
            </div>
          </div>
        </div>

        <h2>Informations complémentaires</h2>
        <textarea
          name="notes"
          placeholder="Commentaires concernant votre commande..."
          onChange={handleChange}
        />
      </div>

      {/* Right - Order Summary */}
      <div className="checkout-order-summary">
        <h3 className="order-section-title">Votre commande</h3>

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
          <span>Sous-total produits</span>
          <span>{totalAmount.toFixed(2)} د.ج</span>
        </div>
        <div className="order-shipping">
          <span>Frais de livraison</span>
          <span>
            {deliveryLoading ? "Calcul..." : 
             deliveryFee > 0 ? `${deliveryFee.toFixed(2)} د.ج` : 
             form.wilaya && form.commune ? "Gratuit" : "À calculer"}
          </span>
        </div>
        <div className="order-total">
          <span><strong>Total</strong></span>
          <span><strong>{finalTotal.toFixed(2)} د.ج</strong></span>
        </div>

        <div className="checkout-note">
          <strong>Méthode de paiement</strong><br />
          Paiement à la livraison<br />
          Payer en argent comptant à la livraison.<br /><br />
          Vos données personnelles seront utilisées pour le traitement de votre commande.
        </div>

        <button
          className="checkout-button"
          onClick={handleOrder}
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Commander"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
