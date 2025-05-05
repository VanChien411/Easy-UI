import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheck, FaChevronRight, FaArrowLeft, FaMobileAlt } from 'react-icons/fa';
import './Payouts.css';
import { useAuth } from '../../../../hooks/useAuth'; // adjust path as needed

const Payouts = () => {
  const navigate = useNavigate();
  // Mock authenticated user data - replace with actual auth integration
  const [userData, setUserData] = useState({
    name: 'User',
    email: 'thomas@example.com',
    avatar: '',
    joined: 'January 2023',
  });

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
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="profile-avatar"
            />
          </div>

          <h1 className="profile-name">
            {userData.name} <span className="profile-subheading">/ Payouts</span>
          </h1>
          <p className="profile-bio">Manage your payment methods</p>
        </div>

        <div className="payouts-layout">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <h2 className="sidebar-heading">ACCOUNT</h2>
            <div className="sidebar-links">
              <Link to="/profile/edit" className="sidebar-nav-item">
                Edit Profile
              </Link>
              <Link to="/profile/password" className="sidebar-nav-item">
                Password
              </Link>
              <Link to="/profile/social" className="sidebar-nav-item">
                Social Profiles
              </Link>
              <Link to="/profile/company" className="sidebar-nav-item">
                Company
              </Link>
              <Link to="/profile/payouts" className="sidebar-nav-item active">
                Payouts
              </Link>
              <Link to="/profile/notifications" className="sidebar-nav-item">
                Email Notifications
              </Link>
              <Link to="/profile/billing" className="sidebar-nav-item">
                Billing
              </Link>
              <Link to="/profile/sessions" className="sidebar-nav-item">
                Sessions
              </Link>
              <Link to="/profile/applications" className="sidebar-nav-item">
                Applications
              </Link>
              <Link to="/profile/data-export" className="sidebar-nav-item">
                Data Export
              </Link>
            </div>

            <div className="delete-account-section">
              <Link to="/profile/delete" className="delete-account-link">
                Delete Account
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="payouts-content">
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
                            <h4 className="method-name">{method.name}</h4>
                            <p className="method-description">{method.description}</p>
                          </div>
                        </div>
                        <div className="payment-method-status">
                          {method.isActive ? (
                            <span className="status-badge active">
                              <FaCheck className="status-icon" />
                              Active
                            </span>
                          ) : method.isAvailable ? null : (
                            <span className="status-badge coming-soon">
                              Coming Soon
                            </span>
                          )}
                          {method.isAvailable && method.id !== 'momo' && <FaChevronRight className="chevron-icon" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="important-note">
                  <h4 className="note-title">Important Note</h4>
                  <p className="note-text">
                    Please ensure that the details you provide are accurate. EASYUI is not 
                    responsible for payments sent to incorrect accounts. If you need help, 
                    please contact our support team.
                  </p>
                </div>
              </div>
            ) : showMoMoSetup ? (
              <div className="card">
                <button onClick={goBack} className="back-button">
                  <FaArrowLeft className="back-icon" /> Back to payment methods
                </button>

                <div className="method-header">
                  <div className="method-logo-container">
                    <FaMobileAlt className="method-detail-logo" />
                  </div>
                  <div>
                    <h2 className="method-detail-title">Mobile Money (MoMo)</h2>
                    <p className="method-detail-description">Set up your Mobile Money account to receive payments</p>
                  </div>
                </div>

                {selectedMethod.isActive && (
                  <div className="status-message active">
                    <div className="status-message-header">
                      <FaCheck className="status-message-icon" /> Active Payment Method
                    </div>
                    <p className="status-message-text">
                      Your Mobile Money account is set up and ready to receive payments.
                    </p>
                  </div>
                )}

                <form className="payment-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      Mobile Money Number <span className="required-field">*</span>
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      className="form-input"
                      value={momoForm.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., 024XXXXXXX"
                      required
                    />
                    <p className="form-hint">
                      Enter the phone number registered with your Mobile Money account
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fullName" className="form-label">
                      Account Holder Name <span className="required-field">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="form-input"
                      value={momoForm.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter the name on your Mobile Money account"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      Save Payment Method
                    </button>
                  </div>
                </form>

                <div className="payment-history">
                  <h3 className="subsection-title">Payment History</h3>
                  <div className="empty-history">
                    <p className="empty-text">You haven't received any payments yet.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <button onClick={goBack} className="back-button">
                  <FaArrowLeft className="back-icon" /> Back to payment methods
                </button>

                <div className="method-coming-soon">
                  <div className="coming-soon-icon">
                    <FaMobileAlt className="icon" />
                  </div>
                  <h2 className="coming-soon-title">{selectedMethod.name} is coming soon!</h2>
                  <p className="coming-soon-text">
                    We're working hard to bring {selectedMethod.name} integration to EASYUI.
                    Stay tuned for updates.
                  </p>
                  <button onClick={goBack} className="coming-soon-back-button">
                    Back to payment methods
                  </button>
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