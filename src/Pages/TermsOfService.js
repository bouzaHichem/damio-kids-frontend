import React from 'react';
import './CSS/LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>Conditions d’Utilisation</h1>
        <nav className="breadcrumb">
          <a href="/">Accueil</a> / <span>Conditions d’Utilisation</span>
        </nav>
        <p className="last-updated">Dernière mise à jour : 3 août 2025</p>
      </header>
      <section className="legal-content">
        <div className="content-wrapper">
          <div className="intro-section">
            <p>
              Bienvenue chez Damio Kids ! Ces conditions générales définissent les règles et 
              réglementations pour l’utilisation de notre site web et de nos services.
            </p>
          </div>
          <div className="section">
            <h2>1. Conditions</h2>
            <p>
              En accédant à notre site web, vous acceptez d’être lié par ces conditions 
              d’utilisation, toutes les lois et réglementations applicables et vous acceptez 
              d’être responsable du respect des lois locales en vigueur.
            </p>
          </div>
          <div className="section">
            <h2>2. Licence d’Utilisation</h2>
            <p>
              L’autorisation est accordée de télécharger temporairement une copie du contenu 
              du site web de Damio Kids pour un usage personnel, non commercial et transitoire uniquement.
            </p>
          </div>
          <div className="section">
            <h2>3. Clause de non-responsabilité</h2>
            <p>
              Les contenus du site web de Damio Kids sont fournis "tels quels". Damio Kids 
              ne donne aucune garantie, expresse ou implicite, et rejette par la présente 
              toute autre garantie.
            </p>
          </div>
          <div className="section">
            <h2>4. Limitations</h2>
            <p>
              En aucun cas, Damio Kids ou ses fournisseurs ne pourront être tenus responsables 
              de tout dommage (y compris, sans limitation, la perte de données ou de bénéfices, 
              ou l’interruption des activités) résultant de l’utilisation ou de l’impossibilité 
              d’utiliser le contenu du site web de Damio Kids.
            </p>
          </div>
          <div className="section">
            <h2>5. Exactitude des Contenus</h2>
            <p>
              Les contenus figurant sur le site web de Damio Kids peuvent contenir des erreurs 
              techniques, typographiques ou photographiques. Damio Kids ne garantit pas que 
              les contenus de son site soient exacts, complets ou à jour.
            </p>
          </div>
          <div className="section">
            <h2>6. Liens</h2>
            <p>
              Damio Kids n’a pas examiné tous les sites liés à son site web et n’est pas 
              responsable du contenu de ces sites liés. L’inclusion de tout lien n’implique 
              pas l’approbation du site par Damio Kids.
            </p>
          </div>
          <div className="section">
            <h2>7. Modifications</h2>
            <p>
              Damio Kids peut réviser ces conditions d’utilisation pour son site web à tout 
              moment et sans préavis. En utilisant ce site web, vous acceptez d’être lié 
              par la version alors en vigueur de ces conditions.
            </p>
          </div>
          <div className="section">
            <h2>8. Loi Applicable</h2>
            <p>
              Ces conditions générales sont régies et interprétées conformément aux lois de 
              notre pays de résidence et vous vous soumettez irrévocablement à la juridiction 
              exclusive des tribunaux de cet État ou lieu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
