import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'neon';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('neon');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'neon', 'theme-light', 'theme-neon', 'dark');
    
    if (theme === 'neon') {
      root.classList.add('theme-neon', 'dark');
    } else {
      root.classList.add('theme-light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'neon' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};