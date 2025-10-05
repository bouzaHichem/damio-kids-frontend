import React, { useState } from "react";
import "./DescriptionBox.css";
import { motion, AnimatePresence } from "framer-motion";

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="acc-item">
      <button className="acc-trigger" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{title}</span>
        <span className={`acc-icon ${open ? 'open' : ''}`}>▾</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="acc-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="acc-content">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DescriptionBox = ({ product }) => {
  return (
    <div className="descriptionbox">
      <div className="acc">
        <Section title="Description" defaultOpen>
          <p>{product?.longDescription || product?.description || '—'}</p>
        </Section>
        <Section title="Features">
          <ul className="feature-list">
            {(product?.features || ['Comfortable design', 'Durable materials', 'Everyday wear']).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </Section>
        <Section title="Size & Care">
          <ul className="feature-list">
            <li>Use our size guide. If between sizes, choose the larger.</li>
            <li>Care: Wipe clean with a damp cloth. Air dry.</li>
            {product?.care_instructions && <li>{product.care_instructions}</li>}
          </ul>
        </Section>
      </div>
    </div>
  );
};

export default DescriptionBox;
