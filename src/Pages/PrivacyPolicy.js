import React from 'react';
import './CSS/LegalPages.css';
import { useI18n } from '../utils/i18n';

const PrivacyPolicy = () => {
  const { t } = useI18n();
  return (
    <div className="legal-page">
      <header className="legal-header">
        <h1>{t('legal.privacy_policy.title')}</h1>
        <nav className="breadcrumb">
          <a href="/">{t('nav.home')}</a> / <span>{t('legal.privacy_policy.title')}</span>
        </nav>
        <p className="last-updated">{t('legal.last_updated', { date: '3 janvier 2025' })}</p>
      </header>
      
      <section className="legal-content">
        <div className="content-wrapper">
          <div className="intro-section">
            <p>
              Chez Damio Kids, nous nous engageons à protéger votre vie privée et à assurer la sécurité de vos informations personnelles. 
              Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations 
              lorsque vous visitez notre site web ou effectuez un achat chez nous.
            </p>
          </div>

          <div className="section">
            <h2>1. Informations que Nous Collectons</h2>
            <div className="subsection">
              <h3>Informations Personnelles</h3>
              <p>Nous collectons les informations que vous nous fournissez directement, notamment :</p>
              <ul>
                <li><strong>Informations de Contact :</strong> Nom, adresse e-mail, numéro de téléphone et adresse postale</li>
                <li><strong>Informations de Compte :</strong> Nom d’utilisateur, mot de passe et préférences de compte</li>
                <li><strong>Informations de Paiement :</strong> Détails de carte bancaire, adresse de facturation et préférences de paiement</li>
                <li><strong>Informations de Commande :</strong> Historique d’achats, préférences de livraison et avis produits</li>
                <li><strong>Données de Communication :</strong> Messages que vous nous envoyez via les formulaires de contact ou le service client</li>
              </ul>
            </div>
            
            <div className="subsection">
              <h3>Informations Collectées Automatiquement</h3>
              <p>Lorsque vous visitez notre site web, nous collectons automatiquement certaines informations :</p>
              <ul>
                <li><strong>Informations sur l’Appareil :</strong> Adresse IP, type de navigateur, système d’exploitation et identifiants de l’appareil</li>
                <li><strong>Données d’Utilisation :</strong> Pages visitées, temps passé sur le site, clics et sources de référence</li>
                <li><strong>Données de Localisation :</strong> Localisation géographique générale basée sur l’adresse IP</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2>2. Comment Nous Utilisons Vos Informations</h2>
            <p>Nous utilisons les informations collectées pour les finalités suivantes :</p>
            <ul>
              <li><strong>Traitement des Commandes :</strong> Traiter et exécuter vos commandes, y compris l’expédition et la livraison</li>
              <li><strong>Service Client :</strong> Répondre à vos demandes et fournir une assistance client</li>
              <li><strong>Gestion de Compte :</strong> Créer et gérer votre compte, y compris l’authentification de connexion</li>
              <li><strong>Communications Marketing :</strong> Vous envoyer des e-mails promotionnels et des newsletters (avec votre consentement)</li>
              <li><strong>Amélioration du Site :</strong> Analyser les habitudes d’utilisation et améliorer les fonctionnalités de notre site</li>
              <li><strong>Prévention des Fraudes :</strong> Détecter et prévenir les transactions frauduleuses et protéger notre entreprise</li>
              <li><strong>Conformité Légale :</strong> Respecter les lois et réglementations en vigueur</li>
            </ul>
          </div>

          <div className="section">
            <h2>3. Cookies et Technologies de Suivi</h2>
            <div className="subsection">
              <h3>Qu’est-ce qu’un Cookie ?</h3>
              <p>
                Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site web. 
                Ils nous aident à vous offrir une meilleure expérience de navigation et à assurer le bon fonctionnement de certaines fonctionnalités.
              </p>
            </div>
            
            <div className="subsection">
              <h3>Types de Cookies que Nous Utilisons</h3>
              <ul>
                <li><strong>Cookies Essentiels :</strong> Nécessaires au bon fonctionnement du site, comme les fonctionnalités du panier d’achat</li>
                <li><strong>Cookies de Performance :</strong> Nous aident à comprendre comment les visiteurs interagissent avec notre site web</li>
                <li><strong>Cookies Fonctionnels :</strong> Mémorisent vos préférences et fournissent des fonctionnalités améliorées</li>
                <li><strong>Cookies Marketing :</strong> Utilisés pour diffuser des publicités pertinentes et suivre l’efficacité des campagnes</li>
              </ul>
            </div>
            
            <div className="subsection">
              <h3>Gestion des Cookies</h3>
              <p>
                Vous pouvez contrôler et gérer les cookies via les paramètres de votre navigateur. Toutefois, la désactivation de certains cookies 
                peut affecter le bon fonctionnement de notre site. La plupart des navigateurs permettent de refuser les cookies ou d’être alerté 
                lorsque des cookies sont envoyés.
              </p>
            </div>
          </div>

          <div className="section">
            <h2>4. Comment Nous Partageons Vos Informations</h2>
            <p>Nous ne vendons, échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager vos informations dans les cas suivants :</p>
            <ul>
              <li><strong>Fournisseurs de Services :</strong> Avec des entreprises tierces de confiance qui nous aident à exploiter notre activité (ex. : prestataires de paiement, transporteurs)</li>
              <li><strong>Exigences Légales :</strong> Lorsque la loi, une ordonnance du tribunal ou la protection de nos droits l’exigent</li>
              <li><strong>Transferts d’Entreprise :</strong> En cas de fusion, acquisition ou vente de nos actifs</li>
              <li><strong>Consentement :</strong> Lorsque vous nous avez donné une permission explicite de partager vos informations</li>
            </ul>
            
            <div className="highlight-box">
              <h4>Prestataires de Services Tiers</h4>
              <p>Nous travaillons avec des entreprises réputées qui fournissent des services tels que :</p>
              <ul>
                <li>Traitement des paiements (Stripe, PayPal)</li>
                <li>Services d’expédition et de livraison</li>
                <li>Plateformes d’e-mail marketing</li>
                <li>Outils d’analyse du site web</li>
              </ul>
              <p>Ces prestataires sont contractuellement tenus de protéger vos informations et ne peuvent les utiliser que pour les services qu’ils nous fournissent.</p>
            </div>
          </div>

          <div className="section">
            <h2>5. Sécurité des Données</h2>
            <p>Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles :</p>
            <ul>
              <li><strong>Chiffrement :</strong> Nous utilisons le chiffrement SSL pour protéger les données transmises entre votre navigateur et nos serveurs</li>
              <li><strong>Stockage Sécurisé :</strong> Les informations personnelles sont stockées sur des serveurs sécurisés avec accès restreint</li>
              <li><strong>Contrôles d’Accès :</strong> Seul le personnel autorisé a accès aux informations personnelles</li>
              <li><strong>Mises à Jour Régulières :</strong> Nous mettons régulièrement à jour nos mesures de sécurité et logiciels</li>
              <li><strong>Surveillance :</strong> Nous surveillons nos systèmes pour détecter toute faille de sécurité potentielle</li>
            </ul>
            <p>
              Bien que nous fassions tout notre possible pour protéger vos informations personnelles, aucun moyen de transmission sur Internet ou 
              de stockage électronique n’est totalement sécurisé. Nous ne pouvons pas garantir une sécurité absolue, mais nous nous engageons à utiliser 
              des pratiques conformes aux standards de l’industrie pour protéger vos données.
            </p>
          </div>

          <div className="section">
            <h2>6. Vos Droits et Choix</h2>
            <p>Vous disposez de plusieurs droits concernant vos informations personnelles :</p>
            
            <div className="subsection">
              <h3>Accès et Mise à Jour</h3>
              <ul>
                <li>Consulter et mettre à jour vos informations de compte à tout moment</li>
                <li>Demander une copie des informations personnelles que nous détenons sur vous</li>
                <li>Corriger toute information inexacte ou incomplète</li>
              </ul>
            </div>
            
            <div className="subsection">
              <h3>Communications Marketing</h3>
              <ul>
                <li>Vous désinscrire des e-mails marketing en cliquant sur le lien de désabonnement</li>
                <li>Refuser les communications promotionnelles via les paramètres de votre compte</li>
                <li>Nous contacter directement pour mettre à jour vos préférences de communication</li>
              </ul>
            </div>
            
            <div className="subsection">
              <h3>Suppression des Données</h3>
              <ul>
                <li>Demander la suppression de vos informations personnelles (sous réserve d’exigences légales)</li>
                <li>Fermer votre compte et supprimer vos données personnelles</li>
                <li>Notez que certaines informations peuvent être conservées à des fins légales ou commerciales</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2>7. Vie Privée des Enfants</h2>
            <p>
              Bien que nos produits soient destinés aux enfants, notre site web et nos services sont conçus pour être utilisés par des adultes. 
              Nous ne collectons pas sciemment d’informations personnelles auprès des enfants de moins de 13 ans. Si nous découvrons que nous 
              avons collecté des informations d’un enfant de moins de 13 ans, nous prendrons des mesures pour supprimer ces informations.
            </p>
            <p>
              Les parents et tuteurs sont responsables de surveiller les activités en ligne de leurs enfants et de s’assurer qu’ils ne fournissent 
              pas d’informations personnelles sans autorisation.
            </p>
          </div>

          <div className="section">
            <h2>8. Transferts Internationaux de Données</h2>
            <p>
              Vos informations peuvent être transférées et traitées dans des pays autres que votre pays de résidence. 
              Ces pays peuvent avoir des lois sur la protection des données différentes. Lorsque nous transférons vos informations à l’international, 
              nous nous assurons que des garanties appropriées sont en place pour protéger vos informations personnelles.
            </p>
          </div>

          <div className="section">
            <h2>9. Modifications de Cette Politique de Confidentialité</h2>
            <p>
              Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre pour refléter les changements de nos pratiques ou des lois applicables. 
              Lorsque nous effectuons des changements, nous allons :
            </p>
            <ul>
              <li>Mettre à jour la date de "Dernière mise à jour" en haut de cette politique</li>
              <li>Vous notifier des changements importants par e-mail ou via un avis sur notre site web</li>
              <li>Publier la politique mise à jour sur notre site web</li>
            </ul>
            <p>
              Nous vous encourageons à consulter régulièrement cette Politique de Confidentialité afin de rester informé sur la manière dont nous protégeons vos informations.
            </p>
          </div>

          <div className="section">
            <h2>10. Contactez-Nous</h2>
            <p>
              Si vous avez des questions, préoccupations ou demandes concernant cette Politique de Confidentialité ou nos pratiques, 
              veuillez nous contacter :
            </p>
            
            <div className="contact-info">
              <div className="contact-method">
                <h4>Email</h4>
                <p><a href="mailto:damiokids24@gmail.com">damiokids24@gmail.com</a></p>
              </div>
              
              <div className="contact-method">
                <h4>Téléphone</h4>
                <p>+213554 32 88 31</p>
              </div>
              
              <div className="contact-method">
                <h4>Adresse Postale</h4>
                <p>
                  Damio Kids - Département Confidentialité<br/>
                  nouvelle ville UV17<br/>
                  Constantine, Algeria 25000<br/>
                  
                </p>
              </div>
              
              <div className="contact-method">
                <h4>Délai de Réponse</h4>
                <p>Nous répondrons à vos demandes liées à la confidentialité dans un délai de 30 jours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
