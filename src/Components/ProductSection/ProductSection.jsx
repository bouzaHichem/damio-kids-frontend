import React from 'react';
import './ProductSection.css';
import ProductCardModern from '../ProductCardModern/ProductCardModern';
import { motion } from 'framer-motion';

const ProductSection = ({ title, products = [], loading, error }) => {
  return (
    <section className="section-wrap" aria-labelledby={`${title.replace(/\s+/g,'-').toLowerCase()}-title`}>
      <div className="container">
        <div className="section-head">
          <h2 id={`${title.replace(/\s+/g,'-').toLowerCase()}-title`} className="section-title">{title}</h2>
        </div>
        {error && (
          <div className="section-error" role="alert">{error}</div>
        )}
        <motion.div
          className="section-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        >
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="pcard skeleton"/>
          )) : products.map((p, i) => (
            <ProductCardModern key={p.id || p._id || i} product={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSection;
