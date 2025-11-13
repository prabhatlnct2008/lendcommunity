import React from 'react';
import { Button } from './Button';
import './Header.css';

interface HeaderProps {
  onJoinClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onJoinClick }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header" role="banner">
      <nav className="header__nav" aria-label="Main navigation">
        <div className="header__logo">
          <a href="/" aria-label="LendCommunity Home">
            <span className="header__logo-text">LendCommunity</span>
          </a>
        </div>

        <div className="header__links">
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="header__link"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection('impact')}
            className="header__link"
          >
            Impact
          </button>
          <button
            onClick={() => scrollToSection('why-lendcommunity')}
            className="header__link"
          >
            Why Us
          </button>
        </div>

        <div className="header__cta">
          <Button onClick={onJoinClick} variant="primary">
            Join Now
          </Button>
        </div>
      </nav>
    </header>
  );
};
