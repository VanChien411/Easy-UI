import React, { useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // User data state
  const [profileData, setProfileData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: '/placeholder.svg',
    joinDate: '2022-05-15',
  purchasedItems: [
    {
      id: "item-1",
      name: "Modern Dashboard UI Kit",
        image: "/placeholder.svg",
      purchaseDate: "2023-04-15",
      price: 990000,
      type: "UI Kit",
      downloads: 3,
    },
      // ... other items
  ],
  favoriteItems: [
    {
      id: "fav-1",
      name: "Landing Page Template",
        image: "/placeholder.svg",
      price: 590000,
      type: "Template",
    },
      // ... other items
    ],
  });

  // Format currency to USD
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD" 
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here
    toast.success("Thông tin cá nhân đã được cập nhật");
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          avatar: e.target?.result
        });
        toast.success("Ảnh đại diện đã được cập nhật");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="avatar-section">
            <img src={profileData.avatar} alt="Avatar" className="profile-avatar" />
            <label className="avatar-upload-button">
              <input type="file" hidden onChange={handleAvatarUpload} />
              Thay đổi ảnh
                    </label>
                  </div>

          <div className="profile-menu">
            <button 
              className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
                  Thông tin cá nhân
            </button>
            <button 
              className={`menu-item ${activeTab === 'purchases' ? 'active' : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
                  Sản phẩm đã mua
            </button>
            <button 
              className={`menu-item ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Sản phẩm yêu thích
            </button>
          </div>
                    </div>

        <div className="profile-main">
          {activeTab === 'profile' && (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Họ và tên</label>
                <input 
                  type="text" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
                          </div>
              <button type="submit" className="save-button">Lưu thay đổi</button>
                        </form>
          )}

          {activeTab === 'purchases' && (
            <div className="purchases-list">
              {profileData.purchasedItems.map(item => (
                <div key={item.id} className="purchase-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)}</p>
                    <p>Ngày mua: {formatDate(item.purchaseDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
          )}

          {activeTab === 'favorites' && (
            <div className="favorites-list">
              {profileData.favoriteItems.map(item => (
                <div key={item.id} className="favorite-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p>{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
