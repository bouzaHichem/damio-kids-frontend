import React from 'react';
import './CSS/About.css';
import heroImage from '../Components/Assets/kids-hero.png';

const About = () => {
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Us</h1>
        <nav className="breadcrumb">
          <a href="/">Home</a> / <span>About</span>
        </nav>
      </header>
      
      <section className="about-content">
        {/* Brand Story */}
        <div className="about-story">
          <h2>Notre Mission </h2>
          <p>
            Chez Damio Kids, nous sommes passionnés par l’art de proposer le meilleur de la mode pour enfants.
            Notre mission est d’allier confort, qualité et style afin de répondre aux besoins uniques de notre jeune clientèle.
            Nous croyons que chaque enfant mérite de se sentir bien et de rayonner dans nos tenues soigneusement sélectionnées.
          </p>
          <img src={heroImage} alt="Kids Fashion" className="about-image" />
        </div>

        {/* Features Grid */}
        <div className="about-features">
          <div className="feature-card">
            <div className="feature-icon">👶</div>
            <h3>La Qualité Avant Tout</h3>
            <p>Des matières haut de gamme, sûres, douces et confortables pour vos petits.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Écoresponsable</h3>
            <p>Des pratiques durables et des matériaux respectueux de l’environnement pour un avenir meilleur.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Designs Élégants</h3>
            <p>Des créations à la fois tendance et intemporelles qui subliment chaque enfant et les font se sentir uniques.</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="about-why">
          <h2>Pourquoi Nous Choisir?</h2>
          <p>
            Grâce à notre engagement pour la durabilité et l’utilisation de matériaux haut de gamme, nous veillons à ce que tous nos produits soient sûrs, durables et respectueux de l’environnement. 
            Du style décontracté aux tenues plus habillées, nous répondons à tous les besoins vestimentaires de vos enfants. 
            Notre équipe sélectionne chaque pièce avec soin afin de garantir un équilibre parfait entre confort, style et qualité.
          </p>
        </div>

        {/* Team Section */}
        <div className="about-team">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">DK</div>
              <h3 className="member-name">Damio Kids Team</h3>
              <p className="member-role">Fashion Curators</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">CS</div>
              <h3 className="member-name">Customer Support</h3>
              <p className="member-role">Always Here to Help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
