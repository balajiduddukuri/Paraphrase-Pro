import React from 'react';
import { MessageSquareQuote, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { triggerHaptic, focusClasses } from '../utils/ui';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    triggerHaptic();
    toggleTheme();
  };

  return (
    <header className="pt-12 pb-6 px-4 relative w-full max-w-4xl mx-auto" role="banner">
      <div className="absolute right-4 top-4 sm:top-12 sm:right-0">
        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg bg-panel border border-border text-muted hover:text-primary transition-colors ${focusClasses}`}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" aria-hidden="true" /> : <Sun className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary rounded-xl shadow-lg shadow-primary/20 mb-4 transition-all duration-300 hover:scale-105">
          <MessageSquareQuote className="w-8 h-8 text-white" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-body sm:text-4xl transition-colors duration-300">
          Paraphrase<span className="text-primary">Pro</span>
        </h1>
        <p className="mt-3 text-lg text-muted max-w-2xl mx-auto transition-colors duration-300">
          Refine your software industry communication with AI-powered tone adjustments.
        </p>
      </div>
    </header>
  );
};

export default Header;