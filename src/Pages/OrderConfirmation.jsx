import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();
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
            🎉 تم تأكيد طلبك بنجاح!
          </h1>
          
          <div className="order-info">
            <div className="order-number">
              <span className="order-label">رقم الطلب:</span>
              <span className="order-value">#{orderNumber}</span>
            </div>
          </div>

          <div className="confirmation-message">
            <div className="message-card">
              <div className="message-icon">📞</div>
              <div className="message-text">
                <h2>سنتصل بك قريباً لتأكيد طلبك</h2>
                <p>
                  شكراً لك على اختيارك متجرنا! سيقوم فريق خدمة العملاء بالاتصال بك خلال الـ 24 ساعة القادمة لتأكيد تفاصيل طلبك وترتيب عملية التسليم.
                </p>
              </div>
            </div>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">🚚</div>
                <h3>التوصيل السريع</h3>
                <p>سيتم توصيل طلبك في غضون 2-5 أيام عمل</p>
              </div>

              <div className="info-card">
                <div className="info-icon">💰</div>
                <h3>الدفع عند الاستلام</h3>
                <p>ادفع بكل راحة عند استلام طلبك</p>
              </div>

              <div className="info-card">
                <div className="info-icon">🔄</div>
                <h3>إرجاع مجاني</h3>
                <p>إمكانية الإرجاع خلال 7 أيام من الاستلام</p>
              </div>
            </div>
          </div>

          <div className="important-notes">
            <h3>📋 ملاحظات مهمة:</h3>
            <ul>
              <li>تأكد من أن رقم هاتفك متاح للاتصال</li>
              <li>سيتم تأكيد العنوان ووقت التسليم معك هاتفياً</li>
              <li>احتفظ برقم الطلب للمتابعة</li>
              <li>في حالة عدم الرد، سنحاول الاتصال عدة مرات</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-primary"
              onClick={handleContinueShopping}
            >
              🛍️ متابعة التسوق
            </button>
            
            <button 
              className="btn-secondary"
              onClick={handleBackToHome}
            >
              🏠 العودة للرئيسية
            </button>
          </div>

          <div className="contact-info">
            <h3>🤝 تحتاج مساعدة؟</h3>
            <p>
              يمكنك التواصل معنا على:
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
          <p>سيتم توجيهك تلقائياً للصفحة الرئيسية خلال 10 ثوان...</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
