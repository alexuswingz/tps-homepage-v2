# ReCharge Subscribe & Save Integration Guide

## Overview
This React application is integrated with ReCharge for Shopify to provide Subscribe & Save functionality for your plant food products.

## Key Features
- ✅ Subscribe & Save option on product pages
- ✅ 15% discount for subscription orders
- ✅ Flexible delivery intervals (1, 2, or 3 months)
- ✅ Subscription management interface
- ✅ Seamless checkout integration with Shopify

## Setup Requirements

### 1. Shopify Configuration
- ReCharge app must be installed and configured in your Shopify admin
- Selling plans must be created for your products
- Products must have subscription options enabled

### 2. API Configuration
The ReCharge API key is configured in `src/services/rechargeService.js`:
```javascript
const RECHARGE_API_KEY = 'sk_1x1_0aadf624a7336243e8fea2dfcd243751145707442bf2e32b3c02bc281b2f46d1';
```

### 3. Checkout Domain
The checkout is configured to use your custom domain:
```javascript
const checkoutDomain = 'https://checkout.tpsplantfoods.com';
```

## Testing & Debugging

### Debug Tools
Three debug pages are available to help test and troubleshoot the integration:

1. **Debug Variants** (`/debug-variants`)
   - Shows all products and variants from your Shopify store
   - Displays both full GraphQL IDs and numeric IDs
   - Allows testing individual variant IDs in cart
   - Use this to verify variant IDs are correct

2. **Selling Plan Debug** (`/selling-plan-debug`)
   - Shows all selling plans configured in your Shopify store
   - Displays selling plan IDs, intervals, and discounts
   - Essential for ReCharge subscription setup
   - Use this to get real selling plan IDs

3. **Test ReCharge** (`/test-recharge`)
   - Complete testing interface for ReCharge functionality
   - Test both one-time and subscription purchases
   - Uses real variant IDs from your store
   - Test checkout process end-to-end

### Testing Steps
1. Navigate to `/debug-variants` to see all available products and variants
2. Navigate to `/test-recharge` to test the integration
3. Select a product and variant
4. Add items to cart (try both one-time and subscription)
5. Test the checkout process
6. Monitor browser console for detailed logs

## Troubleshooting

### Issue: "Cannot apply selling plan to variant" Error

**Problem**: Getting "Cart Error: Cannot apply selling plan to variant" when trying to checkout with subscription items.

**Root Cause**: The selling plan ID being used doesn't exist in your Shopify store or isn't associated with the variant.

**Solution**: ✅ **FIXED**
- Updated code to work without selling plans initially
- Added `/selling-plan-debug` tool to find real selling plan IDs
- Modified checkout to only include selling plan if valid

**Steps to Fix**:
1. Navigate to `/selling-plan-debug` to see available selling plans
2. If no selling plans found:
   - Go to Shopify Admin → Apps → ReCharge
   - Create selling plans for your products
   - Associate selling plans with variants
3. Copy the numeric selling plan IDs from the debug page
4. Update your test data with real selling plan IDs
5. Test again with `/test-recharge`

**Verification**:
1. Check `/selling-plan-debug` shows selling plans for your products
2. Use real selling plan IDs in subscription properties
3. Test checkout process works without errors

### Issue: "Cannot find variant" Error

**Problem**: Getting "Cart Error: Cannot find variant" when trying to checkout.

**Root Cause**: The variant IDs being sent to Shopify checkout are not in the correct format.

**Solution**: ✅ **FIXED**
- Updated variant ID processing to handle both GraphQL format (`gid://shopify/ProductVariant/46733511295205`) and numeric format (`46733511295205`)
- Added robust error handling and validation
- Improved debugging with detailed console logs

**Verification**:
1. Check browser console during checkout for variant ID processing logs
2. Use `/debug-variants` to verify correct variant IDs
3. Test with `/test-recharge` using real variant IDs

### Issue: Subscription Properties Not Working

**Problem**: Subscription items not being recognized by ReCharge.

**Solution**:
- Ensure selling plans are properly configured in Shopify admin
- Verify ReCharge app is properly installed and configured
- Check that subscription properties are being added correctly:
  ```javascript
  shipping_interval_frequency: 2,
  shipping_interval_unit_type: 'month',
  order_interval_frequency: 2,
  order_interval_unit: 'month',
  charge_interval_frequency: 2,
  discount_percentage: '15',
  _rc_widget: '1'
  ```

### Issue: Checkout Redirects Not Working

**Problem**: Checkout process doesn't redirect properly.

**Solution**:
- Verify checkout domain is correct: `https://checkout.tpsplantfoods.com`
- Check that form submission is working properly
- Monitor network requests in browser dev tools
- Ensure CORS settings allow requests from your domain

## File Structure

```
src/
├── components/
│   ├── CartContext.js          # Main cart logic with ReCharge integration
│   ├── ProductPage.js          # Product page with subscription options
│   ├── SubscriptionManager.js  # Customer subscription management
│   ├── TestReCharge.js         # Testing interface
│   └── DebugVariants.js        # Debug tool for variant IDs
├── services/
│   └── rechargeService.js      # ReCharge API service
└── App.js                      # Main app with routes
```

## Key Components

### CartContext.js
- Handles cart state management
- Processes subscription properties
- Manages checkout flow with ReCharge integration
- Handles variant ID formatting and validation

### ProductPage.js
- Displays subscription options
- Builds subscription properties
- Integrates with selling plans from Shopify

### ReChargeService.js
- Handles ReCharge API calls
- Manages customer subscriptions
- Provides subscription management functions

## API Integration

### Shopify Storefront API
- Used to fetch products and variants
- Configured with access token: `d5720278d38b25e4bc1118b31ff0f045`
- Endpoint: `https://n3mpgz-ny.myshopify.com/api/2023-01/graphql.json`

### ReCharge API
- Used for subscription management
- API key configured in service file
- Endpoint: `https://api.rechargeapps.com`

## Subscription Flow

1. **Product Selection**: Customer selects product and subscription options
2. **Cart Addition**: Item added with subscription properties
3. **Checkout**: Form submitted to Shopify with ReCharge properties
4. **Processing**: ReCharge processes subscription based on properties
5. **Management**: Customer can manage subscriptions through ReCharge portal

## Monitoring & Logs

### Browser Console
- Detailed logging during checkout process
- Variant ID processing information
- Subscription property validation
- Error messages and debugging info

### Network Requests
- Monitor form submissions to checkout domain
- Verify correct parameters are being sent
- Check for CORS or network issues

## Support

For issues with the integration:
1. Check browser console for error messages
2. Use debug tools (`/debug-variants` and `/test-recharge`)
3. Verify ReCharge app configuration in Shopify admin
4. Check selling plans are properly set up
5. Monitor network requests during checkout

## Next Steps

1. **Get Real Selling Plan IDs**: Update test data with actual selling plan IDs from ReCharge
2. **Configure Webhooks**: Set up ReCharge webhooks for subscription events
3. **Customer Portal**: Implement customer subscription management interface
4. **Analytics**: Add tracking for subscription conversions and metrics 