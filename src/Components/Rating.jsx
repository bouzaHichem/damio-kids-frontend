import React from 'react';
import PropTypes from 'prop-types';
import './Rating.css';

const Rating = ({ value, max = 5, className = '' }) => {
  const stars = [];
  
  for (let i = 1; i <= max; i++) {
    if (i <= value) {
      stars.push(<span key={i} className="star filled">★</span>);
    } else if (i - 0.5 <= value) {
      stars.push(<span key={i} className="star half">☆</span>);
    } else {
      stars.push(<span key={i} className="star empty">☆</span>);
    }
  }

  return (
    <div className={`rating ${className}`}>
      {stars}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  className: PropTypes.string
};

export default Rating;
