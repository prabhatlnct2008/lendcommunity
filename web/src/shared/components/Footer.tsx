import React from 'react';
import { Button } from './Button';
import './Footer.css';

interface FooterProps {
  onJoinClick: () => void;
  disclaimersHtml?: string;
}

export const Footer: React.FC<FooterProps> = ({ onJoinClick, disclaimersHtml }) => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__cta-section">
        <h2 className="footer__cta-title">Ready to Support Local Entrepreneurs?</h2>
        <p className="footer__cta-subtitle">
          Join our community of investors making a difference in Virginia
        </p>
        <Button onClick={onJoinClick} variant="primary" className="footer__cta-button">
          Join the Community
        </Button>
      </div>

      {disclaimersHtml && (
        <div className="footer__disclaimers">
          <div dangerouslySetInnerHTML={{ __html: disclaimersHtml }} />
        </div>
      )}

      <div className="footer__bottom">
        <p className="footer__copyright">
          © {new Date().getFullYear()} LendCommunity. All rights reserved.
        </p>
        <div className="footer__links">
          <a href="/privacy" className="footer__link">Privacy Policy</a>
          <a href="/terms" className="footer__link">Terms of Service</a>
          <a href="/contact" className="footer__link">Contact</a>
        </div>
      </div>
    </footer>
  );
};
