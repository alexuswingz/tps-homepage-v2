# Subscription Discount Setup Guide

## URGENT: Create SUBSCRIBE15 Discount Code

**If you're getting "SUBSCRIBE15 discount code isn't valid" error, follow these steps immediately:**

### Step 1: Create Discount Code in Shopify Admin
1. Go to your Shopify Admin dashboard
2. Navigate to **Discounts** (in the left sidebar)
3. Click **Create discount** → **Discount code**
4. Configure the discount with these exact settings:
   - **Discount code**: `SUBSCRIBE15`
   - **Type**: Percentage
   - **Value**: `15`
   - **Applies to**: Specific products or collections
   - **Products**: Add all your plant food products (or select "All products")
   - **Customer eligibility**: All customers
   - **Usage limits**: 
     - ☐ Limit number of times this discount can be used in total (leave unchecked)
     - ☐ Limit to one use per customer (leave unchecked)
   - **Active dates**: Set start date to today, no end date
   - **Status**: Active

### Step 2: Test the Discount Code
1. Go to your store's checkout
2. Manually enter `SUBSCRIBE15` in the discount code field
3. Verify it applies 15% off to your products
4. If it works manually, your code will work automatically

## Issue
The cart shows the correct discounted price ($10.19 for a $11.99 item with 15% discount), but the checkout page shows the original price ($11.99).

## Root Cause
ReCharge needs to be properly configured to recognize and apply subscription discounts. There are several approaches to fix this:

## Solution 1: ReCharge Discount Rules (Recommended)

### Option A: Automatic Discount (No Code Required)
1. Log into your ReCharge admin dashboard
2. Go to **Settings** → **Checkout settings**
3. Enable **"Automatically apply subscription discounts"**
4. Go to **Discounts** → **Create discount**
5. Create a new discount with these settings:
   - **Name**: `Subscription Discount 15%`
   - **Type**: Percentage
   - **Value**: 15%
   - **Applies to**: All subscription orders
   - **Auto-apply**: Yes (enable this option)
   - **Usage**: Unlimited
   - **Status**: Active

### Option B: Discount Code Application (Current Implementation)
1. Log into your ReCharge admin dashboard
2. Go to **Discounts** → **Create discount**
3. Create a new discount with these settings:
   - **Discount code**: `SUBSCRIBE15`
   - **Type**: Percentage
   - **Value**: 15%
   - **Applies to**: Subscription orders only
   - **Usage**: Unlimited
   - **Status**: Active

### Step 2: Verify ReCharge Settings
1. Go to **Settings** → **Checkout settings**
2. Ensure "Apply discounts to subscription products" is enabled
3. Check that "Show subscription discounts in cart" is enabled

## Solution 2: Shopify Selling Plans (Alternative)

### Step 1: Create Selling Plans in Shopify
1. Go to Shopify Admin → **Products** → **Selling plans**
2. Create selling plans for each subscription interval:
   - **1 Month Plan**: 15% discount, deliver every 1 month
   - **2 Month Plan**: 15% discount, deliver every 2 months  
   - **3 Month Plan**: 15% discount, deliver every 3 months

### Step 2: Assign Selling Plans to Products
1. Edit each product in Shopify Admin
2. In the **Pricing** section, add the selling plans
3. Set the discount percentage for each plan

### Step 3: Update Code to Use Selling Plans
The code already handles selling plans - just ensure they're properly configured.

## Solution 3: ReCharge Properties (Current Implementation)

The current code sends these properties to ReCharge:
- `subscription_price`: The discounted price
- `discount_amount`: The dollar amount of discount
- `discount_percentage`: The percentage discount (15%)
- `discount_type`: "percentage"
- `_rc_widget`: "1" (ReCharge identifier)

## Testing the Fix

### Test 1: Check Form Data
1. Add a subscription item to cart
2. Open browser console
3. Click checkout
4. Look for console logs showing form data being submitted
5. Verify these fields are present:
   ```
   items[0][properties][subscription_price]: 10.19
   items[0][properties][discount_amount]: 1.80
   items[0][properties][discount_percentage]: 15
   discount: SUBSCRIBE15
   ```

### Test 2: Check ReCharge Dashboard
1. Complete a test checkout
2. Go to ReCharge admin → **Subscriptions**
3. Check if the subscription shows the discounted price
4. Verify the discount is applied correctly

## Troubleshooting

### If discount still not working:

1. **Check ReCharge Integration**:
   - Verify ReCharge app is properly installed
   - Check that products are enabled for subscriptions in ReCharge
   - Ensure ReCharge checkout is configured correctly

2. **Check Discount Code**:
   - Create the `SUBSCRIBE15` discount code in Shopify Admin
   - Set it to 15% off, unlimited usage
   - Apply to subscription products only

3. **Check Product Configuration**:
   - Ensure products are properly synced with ReCharge
   - Verify subscription settings in ReCharge product settings

4. **Alternative: Manual Discount Application**:
   If automatic discounts don't work, you can:
   - Create a discount code in Shopify: `SUBSCRIBE15`
   - The code will automatically apply during checkout
   - Customers will see the discount applied at checkout

## Code Changes Made

### CartContext.js
- Added `subscription_price` property with discounted price
- Added `discount_amount` property with dollar discount
- Added `discount_type` property set to "percentage"
- Added automatic `SUBSCRIBE15` discount code for subscription orders
- Enhanced logging for debugging

### ProductPage.js  
- Fixed subscription property creation to work without selling plans
- Added proper ReCharge widget identifier
- Enhanced subscription property structure

## Next Steps

1. **Immediate**: Create the `SUBSCRIBE15` discount code in Shopify Admin
2. **Short-term**: Configure ReCharge discount rules as described above
3. **Long-term**: Consider implementing Shopify selling plans for better integration

## Support

If issues persist:
1. Check ReCharge documentation for discount configuration
2. Contact ReCharge support for discount rule setup
3. Verify Shopify discount codes are working properly

## How Automatic Discount Application Works

### Option A: Fully Automatic
- **ReCharge handles everything**: When ReCharge detects subscription properties in the cart, it automatically applies the configured discount
- **No code required**: The discount appears at checkout without any discount codes
- **Customer experience**: Customer sees discounted price immediately on checkout page
- **Your code**: The subscription properties (interval, frequency, etc.) are still needed, but discount codes become optional

### Option B: Semi-Automatic (Current Implementation)  
- **Code adds discount automatically**: Your JavaScript automatically adds the `SUBSCRIBE15` discount code during checkout
- **ReCharge applies the code**: ReCharge sees the discount code and applies the 15% discount
- **Customer experience**: Customer sees the discount code applied at checkout
- **Your code**: Continues to work as-is, adding the discount code for subscription orders

### Recommendation
Use **Option A** for the cleanest customer experience. The discount will be applied automatically by ReCharge based on the subscription properties your code is already sending. 