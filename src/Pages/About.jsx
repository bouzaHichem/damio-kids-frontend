import React from 'react';
import './CSS/About.css';
import heroImage from '../Components/Assets/kids-hero.png';
import { useI18n } from '../utils/i18n';

const About = () => {
  const { t } = useI18n();
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>{t('nav.about')}</h1>
        <nav className="breadcrumb">
          <a href="/">{t('nav.home')}</a> / <span>{t('nav.about')}</span>
        </nav>
      </header>
      
      <section className="about-content">
        {/* Brand Story */}
        <div className="about-story">
          <h2>{t('about.our_mission')}</h2>
          <p>
            {t('about.mission_paragraph')}
          </p>
          <img src={heroImage} alt="Kids Fashion" className="about-image" />
        </div>

        {/* Features Grid */}
        <div className="about-features">
          <div className="feature-card">
            <div className="feature-icon">👶</div>
            <h3>{t('about.quality_first')}</h3>
            <p>{t('about.quality_desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>{t('about.eco_friendly')}</h3>
            <p>{t('about.eco_desc')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>{t('about.elegant_designs')}</h3>
            <p>{t('about.designs_desc')}</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="about-why">
          <h2>{t('about.why_choose_us')}</h2>
          <p>
            {t('about.why_paragraph')}
          </p>
        </div>

        {/* Team Section */}
        <div className="about-team">
          <h2>{t('about.team')}</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">DK</div>
              <h3 className="member-name">{t('about.team_name')}</h3>
              <p className="member-role">{t('about.team_role')}</p>
            </div>
            <div className="team-member">
              <div className="member-avatar">CS</div>
              <h3 className="member-name">{t('about.support_name')}</h3>
              <p className="member-role">{t('about.support_role')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
