import React from 'react';
import './ProductSection.css';
import ProductCardModern from '../ProductCardModern/ProductCardModern';
import { motion } from 'framer-motion';
import { useI18n } from '../../utils/i18n';

// variant: 'featured' | 'promo' | 'best'
const ProductSection = ({ title, subtitle, products = [], loading, error, variant = 'featured' }) => {
  const { t } = useI18n();
  const sectionId = `${String(title || '').replace(/\s+/g,'-').toLowerCase()}-title`;
  const computedSubtitle = subtitle || (variant === 'best' ? t('home.trending') : variant === 'promo' ? t('home.promo_products') : t('home.featured_products'));

  return (
    <section className="section-wrap premium-bg" aria-labelledby={sectionId}>
      <div className="container">
        <div className="section-head centered">
          <h2 id={sectionId} className="section-title">{title}</h2>
          <p className="section-subtitle">{computedSubtitle}</p>
        </div>
        {error && (
          <div className="section-error" role="alert">{error}</div>
        )}
        <motion.div
          className="ps-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pcard skeleton"/>
          )) : products.map((p, i) => (
            <ProductCardModern key={p.id || p._id || i} product={p} trending={variant === 'best'} />
          ))}
        </motion.div>
        <div className="section-cta">
          <a className="ps-cta" href="/products">{t('action.view_all')}</a>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
