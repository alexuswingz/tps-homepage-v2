# Scroll to Top Behavior Documentation

This document explains the automatic scroll-to-top behavior implemented in the TPS Plant Foods React application.

## Overview

The application now automatically scrolls to the top of the page on all route changes and page loads, except for specific categorization navigations that need to scroll to particular sections.

## How It Works

### Automatic Scroll to Top
- **Page Refresh**: Always starts from the top
- **Route Changes**: Automatically scrolls to top unless specifically excluded
- **Navigation Links**: All standard navigation scrolls to top
- **Programmatic Navigation**: All `navigate()` calls scroll to top unless specified otherwise

### Exceptions (No Scroll to Top)
The following scenarios will NOT trigger scroll-to-top:

1. **Category Navigation with scrollToCategory state**:
   ```javascript
   navigate('/products', { state: { scrollToCategory: 'House Plants' } });
   ```

2. **Section Navigation**:
   ```javascript
   navigate('/page', { state: { scrollToSection: 'reviews' } });
   ```

3. **Preserved Scroll Navigation**:
   ```javascript
   navigate('/page', { state: { preserveScroll: true } });
   ```

## Implementation Files

### Core Files
- `src/utils/scrollToTop.js` - Utility functions for scroll behavior
- `src/components/ScrollToTop.js` - React component that handles automatic scrolling
- `src/App.js` - Integration point for the ScrollToTop component

### Utility Functions Available

```javascript
import { scrollToTop, scrollToTopInstant, forceScrollToTop } from '../utils/scrollToTop';

// Smooth scroll to top
scrollToTop();

// Instant scroll to top (no animation)
scrollToTopInstant();

// Force scroll to top (ignores all conditions)
forceScrollToTop();
```

## Usage Examples

### Standard Navigation (Scrolls to Top)
```javascript
// Link navigation
<Link to="/products">Products</Link>

// Programmatic navigation
navigate('/products');

// Product page navigation
navigate(`/product/${productId}`);
```

### Category Navigation (Preserves Scroll Behavior)
```javascript
// Navigation to products page with category scroll
<Link 
  to={{
    pathname: "/products",
    state: { scrollToCategory: "House Plants" }
  }}
>
  House Plants
</Link>

// Programmatic category navigation  
navigate('/products', { state: { scrollToCategory: 'Garden Products' } });
```

### Custom Scroll Behavior
```javascript
// Disable scroll to top for specific navigation
navigate('/page', { state: { preserveScroll: true } });

// Navigate to specific section
navigate('/page', { state: { scrollToSection: 'reviews' } });
```

## Manual Scroll Control

You can manually control scrolling in your components:

```javascript
import { scrollToTop, forceScrollToTop } from '../utils/scrollToTop';

// In a form submission handler
const handleFormSubmit = async () => {
  await submitForm();
  scrollToTop(); // Scroll to top after successful submission
};

// Force scroll regardless of current navigation context
const handleResetView = () => {
  forceScrollToTop();
};
```

## Browser Compatibility

The scroll behavior uses modern browser APIs with fallbacks:
- `window.scrollTo({ behavior: 'smooth' })` for modern browsers
- `window.scrollTo(0, 0)` for instant scrolling and older browsers

## Performance Considerations

- The scroll behavior has a 100ms delay on route changes to ensure the page has rendered
- Initial page loads use instant scrolling for better perceived performance
- The ScrollToTop component is lightweight and doesn't render any DOM elements

## Testing

To test the scroll behavior:

1. Navigate between different pages - should scroll to top
2. Use category navigation from navbar - should scroll to specific category
3. Refresh any page - should start from top
4. Use browser back/forward buttons - should scroll to top

## Troubleshooting

If scroll behavior isn't working as expected:

1. Check if the route has `scrollToCategory` or `preserveScroll` state
2. Verify the ScrollToTop component is included in App.js
3. Check browser console for any JavaScript errors
4. Ensure the navigation is using React Router's `navigate` or `Link` components 