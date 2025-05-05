import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaEnvelope, FaMapMarkerAlt, FaGlobe, FaPhone } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import userManagerService from '../../../services/usermanagerService';
import './About.css';

const About = () => {
  const { id: profileId } = useParams();
  const { userId: currentUserId } = useAuth();
  
  // Determine if we're viewing current user's profile or another user's profile
  const targetUserId = profileId || currentUserId;
  
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        let userDetailData;
        
        if (targetUserId) {
          // Fetch specific user's details
          userDetailData = await userManagerService.getUserDetail(targetUserId);
        } else {
          // Fetch current user's details
          userDetailData = await userManagerService.getCurrentUserDetail();
        }
        
        setUserDetail(userDetailData);
        setError(null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user information. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [targetUserId]);

  if (loading) {
    return (
      <div className="about-loading">
        <div className="loading-spinner"></div>
        <p>Loading user information...</p>
      </div>
    );
  }

  if (error) {
    return <div className="about-error">{error}</div>;
  }

  if (!userDetail) {
    return <div className="about-error">User information not found.</div>;
  }

  return (
    <div className="about-container">
      <section className="about-section">
        <h2 className="about-section-title">About</h2>
        {userDetail.bio ? (
          <p className="about-bio">{userDetail.bio}</p>
        ) : (
          <p className="about-bio-empty">No bio information available.</p>
        )}
      </section>

      <section className="about-section">
        <h2 className="about-section-title">Contact Information</h2>
        <div className="contact-info">
          {userDetail.workDisplayEmail && (
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div className="contact-detail">
                <span className="contact-label">Email</span>
                <span className="contact-value">{userDetail.workDisplayEmail}</span>
              </div>
            </div>
          )}
          
          {userDetail.location && (
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div className="contact-detail">
                <span className="contact-label">Location</span>
                <span className="contact-value">{userDetail.location}</span>
              </div>
            </div>
          )}
          
          {userDetail.website && (
            <div className="contact-item">
              <FaGlobe className="contact-icon" />
              <div className="contact-detail">
                <span className="contact-label">Website</span>
                <a href={userDetail.website} target="_blank" rel="noopener noreferrer" className="contact-value website-link">
                  {userDetail.website}
                </a>
              </div>
            </div>
          )}
          
          {userDetail.phoneNumber && (
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div className="contact-detail">
                <span className="contact-label">Phone</span>
                <span className="contact-value">{userDetail.phoneNumber}</span>
              </div>
            </div>
          )}
          
          {!userDetail.workDisplayEmail && !userDetail.location && !userDetail.website && !userDetail.phoneNumber && (
            <p className="contact-empty">No contact information available.</p>
          )}
        </div>
      </section>

      {userDetail.workHistory && userDetail.workHistory.length > 0 && (
        <section className="about-section">
          <h2 className="about-section-title">Work History</h2>
          <div className="history-list">
            {userDetail.workHistory.map((work, index) => (
              <div key={index} className="history-item">
                <h3 className="history-title">{work.title}</h3>
                <div className="history-details">
                  {work.company && <span className="history-company">{work.company}</span>}
                  {(work.yearStart || work.yearEnd) && (
                    <span className="history-period">
                      {work.yearStart || ''} {work.yearStart && work.yearEnd && '–'} {work.yearEnd || ''}
                    </span>
                  )}
                </div>
                {work.description && <p className="history-description">{work.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {userDetail.education && userDetail.education.length > 0 && (
        <section className="about-section">
          <h2 className="about-section-title">Education</h2>
          <div className="history-list">
            {userDetail.education.map((edu, index) => (
              <div key={index} className="history-item">
                <h3 className="history-title">{edu.institution}</h3>
                <div className="history-details">
                  {edu.degree && <span className="history-degree">{edu.degree}</span>}
                  {edu.field && <span className="history-field">{edu.field}</span>}
                  {(edu.startYear || edu.endYear) && (
                    <span className="history-period">
                      {edu.startYear || ''} {edu.startYear && edu.endYear && '–'} {edu.endYear || ''}
                    </span>
                  )}
                </div>
                {edu.description && <p className="history-description">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="about-section">
        <h2 className="about-section-title">Member Since</h2>
        <p className="member-since">
          {userDetail.createdAt 
            ? new Date(userDetail.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })
            : 'Unknown'}
        </p>
      </section>
    </div>
  );
};

export default About; 