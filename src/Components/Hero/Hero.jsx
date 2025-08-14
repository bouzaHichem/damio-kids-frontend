import React from "react";
import "./Hero.css";
import heroImage from "../Assets/Damio-Kids4.png";

const Hero = () => {
  return (
    <section className="hero-only-image">
      <img 
        src={heroImage} 
        alt="Kids fashion collection" 
        className="hero-full-image" 
      />
    </section>
  );
};

export default Hero;
