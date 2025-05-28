import React, { useState, useEffect } from 'react';
import rechargeService from '../services/rechargeService';

const SubscriptionManager = ({ customerId }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchSubscriptions();
    }
  }, [customerId]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await rechargeService.getCustomerSubscriptions(customerId);
      if (response && response.subscriptions) {
        setSubscriptions(response.subscriptions);
      }
    } catch (err) {
      setError('Failed to load subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async (subscriptionId) => {
    try {
      await rechargeService.pauseSubscription(subscriptionId);
      await fetchSubscriptions(); // Refresh the list
      alert('Subscription paused successfully');
    } catch (err) {
      alert('Failed to pause subscription');
    }
  };

  const handleResumeSubscription = async (subscriptionId) => {
    try {
      await rechargeService.resumeSubscription(subscriptionId);
      await fetchSubscriptions(); // Refresh the list
      alert('Subscription resumed successfully');
    } catch (err) {
      alert('Failed to resume subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        await rechargeService.cancelSubscription(subscriptionId);
        await fetchSubscriptions(); // Refresh the list
        alert('Subscription cancelled successfully');
      } catch (err) {
        alert('Failed to cancel subscription');
      }
    }
  };

  const handleUpdateFrequency = async (subscriptionId, newFrequency) => {
    try {
      await rechargeService.updateSubscriptionFrequency(subscriptionId, newFrequency);
      await fetchSubscriptions(); // Refresh the list
      setShowEditModal(false);
      alert('Subscription frequency updated successfully');
    } catch (err) {
      alert('Failed to update subscription frequency');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6b57]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">You don't have any active subscriptions.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Your Subscriptions</h2>
      
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{subscription.product_title}</h3>
                <p className="text-gray-600">{subscription.variant_title}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : subscription.status === 'paused'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-500">Frequency</p>
                <p className="font-medium">Every {subscription.order_interval_frequency} {subscription.order_interval_unit}</p>
              </div>
              <div>
                <p className="text-gray-500">Next Charge</p>
                <p className="font-medium">{new Date(subscription.next_charge_scheduled_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-medium">${subscription.price}</p>
              </div>
              <div>
                <p className="text-gray-500">Quantity</p>
                <p className="font-medium">{subscription.quantity}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedSubscription(subscription);
                  setShowEditModal(true);
                }}
                className="px-4 py-2 bg-[#ff6b57] text-white rounded-md hover:bg-[#ff5a43] transition-colors"
              >
                Edit Frequency
              </button>
              
              {subscription.status === 'active' ? (
                <button
                  onClick={() => handlePauseSubscription(subscription.id)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Pause
                </button>
              ) : subscription.status === 'paused' ? (
                <button
                  onClick={() => handleResumeSubscription(subscription.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Resume
                </button>
              ) : null}
              
              <button
                onClick={() => handleCancelSubscription(subscription.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Frequency Modal */}
      {showEditModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Delivery Frequency</h3>
            <p className="text-gray-600 mb-4">
              Current: Every {selectedSubscription.order_interval_frequency} {selectedSubscription.order_interval_unit}
            </p>
            
            <div className="space-y-2 mb-6">
              {[1, 2, 3].map((months) => (
                <button
                  key={months}
                  onClick={() => handleUpdateFrequency(selectedSubscription.id, months)}
                  className={`w-full p-3 rounded-md border-2 transition-colors ${
                    selectedSubscription.order_interval_frequency === months
                      ? 'border-[#ff6b57] bg-[#fff5f4]'
                      : 'border-gray-200 hover:border-[#ff6b57]'
                  }`}
                >
                  Every {months} month{months > 1 ? 's' : ''}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowEditModal(false)}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager; 