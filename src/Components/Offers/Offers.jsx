import React from "react";
import "./Offers.css";
import exclusive_image from "../Assets/banner09.png";

const Offers = () => {
  return (
    <div className="offers">
      
      <div className="offers-right">
        <a href="/kids">
          <img src={exclusive_image} alt="" />
        </a>
      </div>
    </div>
  );
};

export default Offers;
