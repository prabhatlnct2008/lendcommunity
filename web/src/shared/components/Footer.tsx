import React from 'react';
import './Footer.css';

interface FooterProps {
  onJoinClick?: () => void;
  disclaimersHtml?: string;
}

export const Footer: React.FC<FooterProps> = ({ onJoinClick, disclaimersHtml }) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__logo">
            <div className="footer__logo-icon">❤️</div>
            <div className="footer__logo-text">
              <strong>LendCommunity</strong>
              <span>Fund Local Dreams</span>
            </div>
          </div>
          <p className="footer__tagline">
            Empowering Southeast Asian entrepreneurs in Virginia through community-driven crowdfunding.
          </p>
        </div>

        <div className="footer__links">
          <div className="footer__column">
            <h3 className="footer__column-title">Platform</h3>
            <ul className="footer__link-list">
              <li><a href="/browse" className="footer__link">Browse Startups</a></li>
              <li><a href="/launch" className="footer__link">Launch Your Startup</a></li>
              <li><a href="/how-it-works" className="footer__link">How It Works</a></li>
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__column-title">Community</h3>
            <ul className="footer__link-list">
              <li><a href="/about" className="footer__link">About Us</a></li>
              <li><a href="/stories" className="footer__link">Success Stories</a></li>
              <li><a href="/contact" className="footer__link">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      {disclaimersHtml && (
        <div className="footer__disclaimers">
          <div dangerouslySetInnerHTML={{ __html: disclaimersHtml }} />
        </div>
      )}

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} LendCommunity. Built with ❤️ for Southeast Asian entrepreneurs.
        </p>
      </div>
    </footer>
  );
};
