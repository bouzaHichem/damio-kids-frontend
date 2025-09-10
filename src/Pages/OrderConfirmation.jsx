import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/OrderConfirmation.css";
import { useI18n } from "../utils/i18n";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    // Generate a random order number for display
    const randomOrderNumber = Math.floor(Math.random() * 900000) + 100000;
    setOrderNumber(randomOrderNumber.toString());

    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="order-confirmation-container">
      <div className="confirmation-content">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark-container">
            <div className="checkmark">
              <div className="checkmark-circle"></div>
              <div className="checkmark-stem"></div>
              <div className="checkmark-kick"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="confirmation-main">
          <h1 className="confirmation-title">
            🎉 {t('order_confirmation.title')}
          </h1>
          
          <div className="order-info">
            <div className="order-number">
              <span className="order-label">{t('order_confirmation.order_number_label')}</span>
              <span className="order-value">#{orderNumber}</span>
            </div>
          </div>

          <div className="confirmation-message">
            <div className="message-card">
              <div className="message-icon">📞</div>
              <div className="message-text">
                <h2>{t('order_confirmation.call_soon_title')}</h2>
                <p>
                  {t('order_confirmation.call_soon_desc')}
                </p>
              </div>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">🚚</div>
                <h3>{t('order_confirmation.fast_delivery')}</h3>
                <p>{t('order_confirmation.fast_delivery_desc')}</p>
              </div>

              <div className="info-card">
                <div className="info-icon">💰</div>
                <h3>{t('order_confirmation.cod_title')}</h3>
                <p>{t('order_confirmation.cod_desc')}</p>
              </div>

              <div className="info-card">
                <div className="info-icon">🔄</div>
                <h3>{t('order_confirmation.free_return')}</h3>
                <p>{t('order_confirmation.free_return_desc')}</p>
              </div>
            </div>
          </div>

          <div className="important-notes">
            <h3>📋 {t('order_confirmation.important_notes')}</h3>
            <ul>
              <li>{t('order_confirmation.note_1')}</li>
              <li>{t('order_confirmation.note_2')}</li>
              <li>{t('order_confirmation.note_3')}</li>
              <li>{t('order_confirmation.note_4')}</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={handleContinueShopping}
            >
              🛍️ {t('cart.continue_shopping')}
            </button>
            
            <button 
              className="btn-secondary"
              onClick={handleBackToHome}
            >
              🏠 {t('order_confirmation.back_home')}
            </button>
          </div>

          <div className="contact-info">
            <h3>🤝 {t('order_confirmation.need_help')}</h3>
            <p>
              {t('order_confirmation.contact_intro')}
              <br />
              📧 support@damiokids.com
              <br />
              📞 +213 123 456 789
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-emoji emoji-1">🎁</div>
          <div className="floating-emoji emoji-2">⭐</div>
          <div className="floating-emoji emoji-3">🎈</div>
          <div className="floating-emoji emoji-4">🌟</div>
          <div className="floating-emoji emoji-5">💫</div>
          <div className="floating-emoji emoji-6">🎊</div>
        </div>

        {/* Auto-redirect notice */}
        <div className="auto-redirect">
          <p>{t('order_confirmation.auto_redirect_notice', { seconds: 10 })}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
