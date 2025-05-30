import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop, scrollToTopInstant, shouldScrollToTop } from '../utils/scrollToTop';

const ScrollToTop = () => {
  const location = useLocation();

  // Handle initial page load/refresh
  useEffect(() => {
    // On initial load, instantly scroll to top unless it's a categorization link
    if (shouldScrollToTop(location)) {
      scrollToTopInstant();
    }
  }, []); // Empty dependency array means this runs only on mount

  // Handle route changes
  useEffect(() => {
    // Check if we should scroll to top for this navigation
    if (shouldScrollToTop(location)) {
      // Small delay to ensure the page has rendered
      const timeoutId = setTimeout(() => {
        scrollToTop();
      }, 100);
      
      // Cleanup timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, location.state]);

  return null; // This component doesn't render anything
};

export default ScrollToTop; 