// Utility function to scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

// Utility function to instantly scroll to top (no smooth animation)
export const scrollToTopInstant = () => {
  window.scrollTo(0, 0);
};

// Utility function to force scroll to top (ignores all conditions)
export const forceScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

// Utility function to check if navigation should scroll to top
export const shouldScrollToTop = (location) => {
  // Don't scroll to top if we're going to a category with scroll state
  if (location.state && location.state.scrollToCategory) {
    return false;
  }
  
  // Don't scroll to top if we're going to a specific section
  if (location.state && location.state.scrollToSection) {
    return false;
  }
  
  // Don't scroll to top if explicitly disabled
  if (location.state && location.state.preserveScroll) {
    return false;
  }
  
  // For all other navigations, scroll to top
  return true;
}; 