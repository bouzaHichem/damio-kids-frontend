import React, { useState } from 'react';
import './CSS/Contact.css';
// import instagram_icon from '../Components/Assets/instagram_icon.png'; // Not used
import { useI18n } from '../utils/i18n';

const Contact = () => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('');

    try {
      // Call backend to send email
      const { contactService } = await import('../services/apiService');
      const res = await contactService.submitContact(formData);

      if (res?.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>{t('nav.contact')}</h1>
        <nav className="breadcrumb">
          <a href="/">{t('nav.home')}</a> / <span>{t('nav.contact')}</span>
        </nav>
      </header>
      
      <section className="contact-content">
        <h2>{t('contact.get_in_touch')}</h2>
        
        <div className="contact-form-container">
          <form className={`contact-form ${isLoading ? 'loading' : ''}`} onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder={t('contact.your_name')} 
              value={formData.name}
              onChange={handleInputChange}
              required 
            />
            <input 
              type="email" 
              name="email"
              placeholder={t('contact.your_email')} 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
            <textarea 
              name="message"
              placeholder={t('contact.your_message')} 
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button 
              type="submit" 
              className={isLoading ? 'loading' : ''}
              disabled={isLoading}
            >
              {isLoading ? t('contact.sending') : t('contact.send_message')}
            </button>
            
            {submitStatus === 'success' && (
              <div className="form-message success">
                {t('contact.success_message')}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="form-message error">
                {t('contact.error_message')}
              </div>
            )}
          </form>
        </div>
        
        <div className="contact-info">
          <h2>{t('contact.visit_us')}</h2>
          <p>📍 {t('contact.address')}: nouvelle ville UV17, Constantine, Algeria 25000</p>
          <p>📞 {t('contact.phone')}: 0554 32 88 31</p>
          <p>✉️ {t('contact.email')}: damiokids24@gmail.com</p>
          <p>🕒 {t('contact.hours')}: Mon-Sat 9AM-7PM, Sun 10AM-6PM</p>
        </div>
        
        <div className="contact-social">
          <h2>{t('footer.follow_us')}</h2>
          <div className="social-icons">
            <a href="https://www.instagram.com/damio.kids?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@damio.kids?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61566857383952" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3217.7199413810104!2d6.5772302!3d36.2462966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f165cbde15ff0f%3A0x1860b98d8e4592c3!2sDamio%20kids!5e0!3m2!1sfr!2sdz!4v1754221350313!5m2!1sfr!2sdz"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map - Damio Kids Store Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default Contact;

