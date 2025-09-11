import React, { useContext, useMemo, useState } from 'react';
import './ProductCardModern.css';
import { motion } from 'framer-motion';
import { ShopContext } from '../../Context/ShopContext';
import { getImageUrl } from '../../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../utils/i18n';

const ProductCardModern = ({ product, trending = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(ShopContext);
  const { t } = useI18n();
  const [wish, setWish] = useState(false);

  const id = product?.id ?? product?._id;
  const name = product?.name ?? '';
  const image = product?.image ?? '';
  const newPrice = Number(product?.new_price ?? 0);
  const oldPrice = Number(product?.old_price ?? 0);

  const hasDiscount = useMemo(() => oldPrice > newPrice && newPrice > 0, [oldPrice, newPrice]);
  const discountPct = useMemo(() => hasDiscount ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0, [hasDiscount, oldPrice, newPrice]);

  const onWishlist = () => {
    try {
      const key = 'wishlist';
      const current = JSON.parse(localStorage.getItem(key) || '[]');
      const exists = current.includes(id);
      const next = exists ? current.filter(x => x !== id) : [...current, id];
      localStorage.setItem(key, JSON.stringify(next));
      setWish(!exists);
    } catch {}
  };

  return (
    <motion.article
      className="pcard"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-label={name}
    >
      <div className="pcard-media">
        {hasDiscount && <span className="pcard-badge">-{discountPct}%</span>}
        {trending && <span className="pcard-badge trend">🔥 {t('home.trending')}</span>}
        <img src={getImageUrl(image)} alt={name} loading="lazy" onError={(e)=>{e.currentTarget.src='/api/placeholder/600/400'}} />
        <div className="pcard-actions" role="group" aria-label="Quick actions">
          <button className="pcard-btn" onClick={() => addToCart(id)} aria-label={t('action.add_to_cart')}>{t('action.add_to_cart')}</button>
          <button className="pcard-icon" aria-pressed={wish} onClick={onWishlist} aria-label="Toggle wishlist">❤</button>
          <button className="pcard-icon" onClick={() => navigate(`/product/${id}`)} aria-label="Quick view">👁</button>
        </div>
      </div>
      <div className="pcard-info">
        <h3 className="pcard-title" title={name}>{name}</h3>
        <div className="pcard-price">
          <span className="price-new">{newPrice} <span className="cur">د.ج</span></span>
          {hasDiscount && <span className="price-old">{oldPrice} د.ج</span>}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCardModern;
