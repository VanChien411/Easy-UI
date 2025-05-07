import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaChevronRight, FaArrowLeft, FaMobileAlt } from 'react-icons/fa';
import './Payouts.css';
import { useAuth } from '../../../../hooks/useAuth'; // adjust path as needed
import { ProfileHeader, ProfileSidebar } from '../shared';

const Payouts = () => {
  const navigate = useNavigate();
  
  // Selected payment method and view states
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showMoMoSetup, setShowMoMoSetup] = useState(false);

  // Form data for MoMo setup
  const [momoForm, setMomoForm] = useState({
    phoneNumber: '',
    fullName: '',
  });

  // Payment methods available in the system
  const paymentMethods = [
    {
      id: 'momo',
      name: 'Mobile Money (MoMo)',
      logo: '/images/momo-logo.png', // Replace with actual logo path
      isActive: true,
      isAvailable: true,
      description: 'Receive payments directly to your mobile money account',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      logo: '/images/bank-logo.png', // Replace with actual logo path
      isActive: false,
      isAvailable: false,
      description: 'Receive payments directly to your bank account',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '/images/paypal-logo.png', // Replace with actual logo path
      isActive: false,
      isAvailable: false,
      description: 'Connect your PayPal account to receive payments',
    },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMomoForm({
      ...momoForm,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically make an API call to save the payment method
    console.log('Saving MoMo details:', momoForm);
    
    // Update the payment method to be active
    const updatedMethods = paymentMethods.map(method => {
      if (method.id === 'momo') {
        return { ...method, isActive: true };
      }
      return method;
    });
    
    // For demonstration, we're just showing success and returning to the list
    setTimeout(() => {
      setShowMoMoSetup(false);
      setSelectedMethod(null);
    }, 1000);
  };

  // Reset forms when changing views
  useEffect(() => {
    if (!showMoMoSetup) {
      setMomoForm({
        phoneNumber: '',
        fullName: '',
      });
    }
  }, [showMoMoSetup]);

  // View a specific payment method
  const viewPaymentMethod = (methodId) => {
    // Skip MoMo since it's already active
    if (methodId === 'momo') return;
    
    const method = paymentMethods.find(m => m.id === methodId);
    if (method && method.isAvailable) {
      setSelectedMethod(method);
      if (methodId === 'momo') {
        setShowMoMoSetup(true);
      }
    }
  };

  // Go back to the payment methods list
  const goBack = () => {
    setSelectedMethod(null);
    setShowMoMoSetup(false);
  };

  return (
    <div className="payouts-page">
      <div className="profile-container">
        {/* Use the shared ProfileHeader component */}
        <ProfileHeader 
          section="Payouts"
          description="Manage your payment methods"
        />

        <div className="profile-layout">
          {/* Use the shared ProfileSidebar component */}
          <ProfileSidebar activeTab="payouts" />

          {/* Main Content */}
          <div className="profile-content">
            {!selectedMethod ? (
              <div className="card">
                <h2 className="section-title">Payment Methods</h2>
                <p className="description-text">
                  Select how you want to receive your earnings from EASYUI. 
                  We'll send your payments according to the payment schedule.
                </p>

                {/* Payment Methods List */}
                <div className="payment-methods-list">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id}
                      className={`payment-method-item ${method.isAvailable ? (method.id === 'momo' ? '' : 'available') : 'unavailable'}`}
                      onClick={() => method.id !== 'momo' && method.isAvailable && viewPaymentMethod(method.id)}
                    >
                      <div className="payment-method-content">
                        <div className="payment-method-info">
                          <div className="payment-method-logo">
                            {/* Replace with actual logo or use an icon as fallback */}
                            <FaMobileAlt className="method-logo-img" />
                          </div>
                          <div className="payment-method-details">
                            <h3 className="payment-method-name">{method.name}</h3>
                            <p className="payment-method-description">{method.description}</p>
                          </div>
                        </div>
                        {method.isActive ? (
                          <div className="payment-method-active">
                            <FaCheck className="active-icon" /> Active
                          </div>
                        ) : method.isAvailable ? (
                          <FaChevronRight className="method-action-icon" />
                        ) : (
                          <div className="payment-method-inactive">Coming Soon</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card method-setup-card">
                <div className="method-setup-header">
                  <button className="back-button" onClick={goBack}>
                    <FaArrowLeft /> Back
                  </button>
                  <h2 className="section-title">{selectedMethod.name} Setup</h2>
                </div>
                
                <div className="method-setup-content">
                  {/* Method specific setup form would go here */}
                  <p className="setup-description">
                    This payment method is coming soon. We'll notify you when it's available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payouts; 