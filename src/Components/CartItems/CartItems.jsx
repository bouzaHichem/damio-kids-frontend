import React, { useContext, useMemo, useState } from "react";
import "./CartItems.css";
import cross_icon from "../Assets/cart_cross_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { currency } from "../../App";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUtils";
import { useI18n } from "../../utils/i18n";

const CartItems = () => {
  const { products, cartItems, addToCart, removeFromCart, setCartItems, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const { t } = useI18n();

  const items = useMemo(
    () => products.filter((p) => {
      const entry = cartItems[p.id];
      const qty = typeof entry === 'number' ? entry : (entry?.quantity || 0);
      return qty > 0;
    }),
    [products, cartItems]
  );

  const subtotal = getTotalCartAmount();
  const shipping = 0;
  const total = subtotal + shipping;

  const handleRemoveAll = (id) => {
    setCartItems((prev) => ({ ...prev, [id]: 0 }));
  };

  const formatPrice = (value) => `${currency}${value}`;

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="card">
          <h2>{t('cart.empty')}</h2>
          <p>{t('cart.empty_subtitle')}</p>
          <div className="actions">
            <button className="btn-primary" onClick={() => navigate('/')}>{t('cart.start_shopping')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cartx">
      <div className="cart-grid container">
        {/* Cart list */}
        <section className="cart-list">
          <h1 className="title">{t('cart.title')}</h1>
          <div className="list">
            {items.map((p) => {
              const entry = cartItems[p.id];
              const qty = typeof entry === 'number' ? entry : (entry?.quantity || 0);
              const variant = typeof entry === 'number' ? null : (entry?.variant || null);
              const unit = Number(p.new_price || 0);
              const old = Number(p.old_price || 0);
              const hasDiscount = old > unit && unit > 0;
              const discountPct = hasDiscount ? Math.round(((old - unit) / old) * 100) : 0;
              return (
                <div key={p.id} className="cart-row">
                  <div className="media">
                    <img src={getImageUrl(p.image)} alt={p.name} />
                  </div>
                  <div className="info">
                    <h3 className="name" title={p.name}>{p.name}</h3>
                    {variant && (
                      <div className="variant-line">
                        {variant.size && <span className="variant-pill">Size: {variant.size}</span>}
                        {variant.color && <span className="variant-pill">Color: {variant.color}</span>}
                        {variant.age && <span className="variant-pill">Age: {variant.age}</span>}
                      </div>
                    )}
                    <div className="price-line">
                      <span className="price-new">{formatPrice(unit)}</span>
                      {hasDiscount && (<>
                        <span className="price-old">{formatPrice(old)}</span>
                        <span className="badge-discount">-{discountPct}%</span>
                      </>)}
                    </div>
                  </div>
                  <div className="qty">
                    <button aria-label="Decrease" onClick={() => removeFromCart(p.id)}>-</button>
                    <input readOnly value={qty} aria-label="Quantity" />
                    <button aria-label="Increase" onClick={() => addToCart(p.id)}>+</button>
                  </div>
                  <div className="line-total">{formatPrice(unit * qty)}</div>
                  <button className="remove" aria-label="Remove" onClick={() => handleRemoveAll(p.id)}>
                    <img src={cross_icon} alt="remove" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Summary */}
        <aside className="cart-summary">
          <div className="card">
            <h2>{t('checkout.order_summary')}</h2>
            <div className="summary-row">
              <span>{t('cart.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>{t('cart.shipping')}</span>
              <span>{shipping === 0 ? t('cart.shipping_free') : formatPrice(shipping)}</span>
            </div>
            <div className="divider" />
            <div className="summary-row total">
              <span>{t('cart.total')}</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="promo">
              <label htmlFor="promo">{t('cart.promo_code')}</label>
              <div className="promo-box">
                <input id="promo" value={promo} onChange={(e)=>setPromo(e.target.value)} placeholder={t('cart.promo_placeholder')} />
                <button className="btn-dark" onClick={(e)=>e.preventDefault()}>{t('action.apply')}</button>
              </div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/checkout')}>
              {t('cart.proceed_to_checkout')}
            </button>
            <button className="btn-ghost" onClick={() => navigate('/')}>{t('cart.continue_shopping')}</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartItems;
