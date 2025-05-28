// ReCharge API Service
// This service handles all ReCharge subscription-related functionality

const RECHARGE_API_KEY = 'sk_1x1_0aadf624a7336243e8fea2dfcd243751145707442bf2e32b3c02bc281b2f46d1';
const RECHARGE_API_URL = 'https://api.rechargeapps.com';

class ReChargeService {
  constructor() {
    this.apiKey = RECHARGE_API_KEY;
    this.apiUrl = RECHARGE_API_URL;
  }

  // Helper method to make API requests
  async makeRequest(endpoint, method = 'GET', data = null) {
    const headers = {
      'X-Recharge-Access-Token': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const options = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, options);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors ? error.errors[0] : 'ReCharge API error');
      }

      return await response.json();
    } catch (error) {
      console.error('ReCharge API Error:', error);
      throw error;
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      return await this.makeRequest(`/subscriptions/${subscriptionId}`);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
  }

  // Create a subscription (usually handled by Shopify checkout, but available if needed)
  async createSubscription(subscriptionData) {
    try {
      return await this.makeRequest('/subscriptions', 'POST', subscriptionData);
    } catch (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
  }

  // Update subscription frequency
  async updateSubscriptionFrequency(subscriptionId, frequency, frequencyUnit = 'month') {
    try {
      const data = {
        order_interval_frequency: frequency,
        order_interval_unit: frequencyUnit,
        charge_interval_frequency: frequency
      };
      
      return await this.makeRequest(`/subscriptions/${subscriptionId}`, 'PUT', data);
    } catch (error) {
      console.error('Error updating subscription frequency:', error);
      return null;
    }
  }

  // Pause subscription
  async pauseSubscription(subscriptionId) {
    try {
      return await this.makeRequest(`/subscriptions/${subscriptionId}/pause`, 'POST');
    } catch (error) {
      console.error('Error pausing subscription:', error);
      return null;
    }
  }

  // Resume subscription
  async resumeSubscription(subscriptionId) {
    try {
      return await this.makeRequest(`/subscriptions/${subscriptionId}/activate`, 'POST');
    } catch (error) {
      console.error('Error resuming subscription:', error);
      return null;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, reason = 'Customer requested cancellation') {
    try {
      const data = {
        cancellation_reason: reason
      };
      
      return await this.makeRequest(`/subscriptions/${subscriptionId}/cancel`, 'POST', data);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return null;
    }
  }

  // Get customer's subscriptions
  async getCustomerSubscriptions(customerId) {
    try {
      return await this.makeRequest(`/subscriptions?customer_id=${customerId}`);
    } catch (error) {
      console.error('Error fetching customer subscriptions:', error);
      return null;
    }
  }

  // Skip next charge
  async skipNextCharge(chargeId) {
    try {
      return await this.makeRequest(`/charges/${chargeId}/skip`, 'POST');
    } catch (error) {
      console.error('Error skipping charge:', error);
      return null;
    }
  }

  // Get upcoming charges
  async getUpcomingCharges(customerId) {
    try {
      return await this.makeRequest(`/charges?customer_id=${customerId}&status=queued`);
    } catch (error) {
      console.error('Error fetching upcoming charges:', error);
      return null;
    }
  }

  // Validate subscription parameters for checkout
  validateSubscriptionParams(subscriptionProps) {
    const required = [
      'selling_plan',
      'charge_interval_frequency',
      'order_interval_frequency',
      'order_interval_unit'
    ];

    for (const field of required) {
      if (!subscriptionProps[field]) {
        console.warn(`Missing required subscription field: ${field}`);
        return false;
      }
    }

    return true;
  }

  // Format subscription properties for Shopify checkout
  formatForCheckout(subscriptionProps) {
    return {
      selling_plan: subscriptionProps.selling_plan,
      properties: {
        shipping_interval_frequency: subscriptionProps.charge_interval_frequency,
        shipping_interval_unit_type: subscriptionProps.order_interval_unit,
        order_interval_frequency: subscriptionProps.order_interval_frequency,
        order_interval_unit: subscriptionProps.order_interval_unit,
        charge_interval_frequency: subscriptionProps.charge_interval_frequency,
        discount_percentage: subscriptionProps.discount || '15',
        _rc_widget: '1'
      }
    };
  }
}

// Export singleton instance
export default new ReChargeService(); 