import React, { useEffect, useState } from 'react';
import './VariantSelectorModal.css';

const VariantSelectorModal = ({ product, onConfirm, onClose }) => {
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const requiresSize = Array.isArray(product?.sizes) && product.sizes.length > 0;
  const requiresColor = Array.isArray(product?.colors) && product.colors.length > 0;
  const valid = (!requiresSize || !!size) && (!requiresColor || !!color);

  useEffect(() => {
    // Do not preselect; force a user choice
  }, [product]);

  return (
    <div className="var-modal-backdrop" role="dialog" aria-modal="true">
      <div className="var-modal">
        <div className="var-modal-header">
          <h3>Select options</h3>
          <button className="var-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="var-modal-body">
          {requiresSize && (
            <div className="var-group">
              <div className="var-label">Size</div>
              <div className="var-options">
                {product.sizes.map((s) => (
                  <button key={s} className={`var-chip ${size === s ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
          {requiresColor && (
            <div className="var-group">
              <div className="var-label">Color</div>
              <div className="var-options">
                {product.colors.map((c) => (
                  <button key={c} className={`var-chip ${color === c ? 'active' : ''}`} onClick={() => setColor(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="var-modal-footer">
          <button className="var-confirm" disabled={!valid} onClick={() => valid && onConfirm({ size: size || undefined, color: color || undefined })}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantSelectorModal;