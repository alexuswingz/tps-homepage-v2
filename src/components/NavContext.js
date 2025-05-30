import React, { createContext, useState, useContext } from 'react';

const NavContext = createContext();

export const useNav = () => useContext(NavContext);

export const NavProvider = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  return (
    <NavContext.Provider value={{
      mobileMenuOpen,
      openMobileMenu,
      closeMobileMenu,
      toggleMobileMenu
    }}>
      {children}
    </NavContext.Provider>
  );
}; 