import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEnvelope, FaTimes } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import userManagerService from "../../../services/usermanagerService";
import { showSuccessAlert, showErrorAlert } from "../../../utils/alertUtils";
import "./EditProfile.css";

// Predefined job types
const JOB_TYPES = [
  "UX/UI Design",
  "Frontend Development",
  "Backend Development",
  "Mobile Development",
  "Full Stack Development",
  "DevOps",
  "Data Science",
  "Product Management",
  "Project Management",
  "Quality Assurance",
  "Other"
];

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showJobSelector, setShowJobSelector] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  
  // Initialize education form with the exact field names expected by the API
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    description: ""
  });
  
  // Initialize user state with default values
  const [user, setUser] = useState({
    name: "",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "",
    location: "",
    workEmail: "",
    phoneNumber: "",
    website: "",
    customUrl: "",
    workHistory: [],
    education: []
  });

  // Load user details from API
  useEffect(() => {
    const loadUserDetails = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userDetail = await userManagerService.getCurrentUserDetail();
        
        // Ensure workHistory and education have all required fields
        const formattedWorkHistory = (userDetail.workHistory || []).map(job => ({
          title: job.title || "",
          company: job.company || "",
          yearStart: job.yearStart || "",
          yearEnd: job.yearEnd || "",
          description: job.description || ""
        }));

        const formattedEducation = (userDetail.education || []).map(edu => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          startYear: edu.startYear || "",
          endYear: edu.endYear || "",
          description: edu.description || ""
        }));
        
        setUser({
          name: userDetail.fullName || userDetail.userName || "",
          avatar: userDetail.avatar || "/placeholder.svg?height=100&width=100",
          bio: userDetail.bio || "",
          location: userDetail.location || "",
          workEmail: userDetail.workDisplayEmail || userDetail.email || "",
          phoneNumber: userDetail.phoneNumber || "",
          website: userDetail.website || "",
          customUrl: userDetail.userName || "",
          workHistory: formattedWorkHistory,
          education: formattedEducation
        });
      } catch (error) {
        console.error("Failed to load user details:", error);
        showErrorAlert("Failed to load user details. Please try again later.");
        
        // Fall back to auth data if API fails
        if (authUser) {
      setUser(prevUser => ({
        ...prevUser,
        name: authUser.name || authUser.userName || prevUser.name,
        avatar: authUser.avatar || prevUser.avatar,
        workEmail: authUser.email || prevUser.workEmail,
      }));
    }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserDetails();
  }, [isAuthenticated, authUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      
      console.log("Submitting profile data:", {
        workHistory: user.workHistory,
        education: user.education
      });
      
      // Prepare data for API request with the exact structure required by the backend
      const profileData = {
        fullName: user.name,
        location: user.location,
        bio: user.bio,
        website: user.website,
        workDisplayEmail: user.workEmail,
        phoneNumber: user.phoneNumber,
        workHistory: user.workHistory.map(job => ({
          title: job.title || "",
          company: job.company || "",
          yearStart: job.yearStart || "",
          yearEnd: job.yearEnd || "",
          description: job.description || ""
        })),
        education: user.education.map(edu => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          startYear: edu.startYear || "",
          endYear: edu.endYear || "",
          description: edu.description || ""
        }))
      };
      
      // Call the API to update profile
      await userManagerService.updateUserProfile(profileData);
      
      showSuccessAlert("Profile updated successfully!");
      
    // Redirect to profile page
    navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showErrorAlert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle selecting a job
  const handleSelectJob = (jobType) => {
    setUser(prev => ({
      ...prev,
      workHistory: [...prev.workHistory, { 
        title: jobType, 
        company: "", 
        yearStart: "", 
        yearEnd: "",
        description: "" 
      }]
    }));
    setShowJobSelector(false);
  };

  // Handle removing a job
  const handleRemoveJob = (index) => {
    setUser(prev => ({
      ...prev,
      workHistory: prev.workHistory.filter((_, i) => i !== index)
    }));
  };

  // Handle changing job details
  const handleJobChange = (index, field, value) => {
    setUser(prev => {
      const updatedWorkHistory = [...prev.workHistory];
      updatedWorkHistory[index] = {
        ...updatedWorkHistory[index],
        [field]: value
      };
      return {
        ...prev,
        workHistory: updatedWorkHistory
      };
    });
  };

  // Handle education change
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new education
  const handleAddEducation = () => {
    if (!newEducation.institution || !newEducation.degree) {
      showErrorAlert("Institution and Degree are required fields");
      return;
    }

    setUser(prev => ({
      ...prev,
      education: [...prev.education, {
        ...newEducation,
        description: newEducation.description || "" // Ensure description field is always included
      }]
    }));

    // Reset form
    setNewEducation({
      institution: "",
      degree: "",
      field: "",
      startYear: "",
      endYear: "",
      description: ""
    });
    setShowEducationForm(false);
  };

  // Remove education
  const handleRemoveEducation = (index) => {
    setUser(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="loading-indicator">Loading profile data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-container">
        <div className="profile-header-section">
          <div className="profile-header-avatar">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar-small"
            />
          </div>
          <div>
            <h1 className="edit-profile-title">
              {user.name} <span className="edit-profile-subtitle">/ Edit Profile</span>
            </h1>
            <p className="edit-profile-description">Set up your Easy UI presence and profile information</p>
          </div>
        </div>

        <div className="edit-profile-layout">
          {/* Sidebar */}
          <div className="edit-profile-sidebar">
            <div className="sidebar-sticky">
              <h2 className="sidebar-heading">General</h2>
              <nav className="sidebar-nav">
                <Link
                  to="/profile/edit"
                  className="sidebar-nav-item active"
                >
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
                <Link to="/profile/payouts" className="sidebar-nav-item">
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
              </nav>

              <div className="delete-account-section">
                <Link to="/profile/delete" className="delete-account-link">
                  Delete Account
                </Link>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="edit-profile-content">
            <form onSubmit={handleSubmit}>
              {/* Profile picture section */}
              <div className="profile-picture-section">
                <div className="profile-picture-container">
                  <div className="profile-picture-wrapper">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="profile-picture"
                    />
                  </div>
                  <div className="profile-picture-actions">
                    <button
                      type="button"
                      className="profile-picture-button"
                    >
                      Upload new picture
                    </button>
                    <button
                      type="button"
                      className="profile-picture-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic info section */}
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name <span className="required-field">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <div className="form-input-with-icon">
                    <FaSearch className="form-input-icon" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={user.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                      className="form-input with-icon"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-label-with-counter">
                    <label htmlFor="bio" className="form-label">
                      Bio
                    </label>
                    <span className="form-counter">{user.bio.length}/1024</span>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    rows={5}
                    className="form-textarea"
                    maxLength={1024}
                  ></textarea>
                </div>
              </div>

              {/* Work history & education */}
              <div className="form-section">
                <h2 className="section-title">Work History & Education</h2>

                <div className="work-education-section">
                  <div className="work-history-item">
                    <h3 className="subsection-title">Work History</h3>
                    
                    {/* Display existing work history */}
                    {user.workHistory.length > 0 && (
                      <div className="work-history-list">
                        {user.workHistory.map((job, index) => (
                          <div key={index} className="work-history-entry">
                            <div className="entry-header">
                              <h4 className="entry-title">{job.title}</h4>
                              <button 
                                type="button" 
                                className="remove-button"
                                onClick={() => handleRemoveJob(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                            <div className="entry-form">
                              <div className="entry-field">
                                <label>Company</label>
                                <input 
                                  type="text" 
                                  value={job.company || ''} 
                                  onChange={(e) => handleJobChange(index, 'company', e.target.value)}
                                  placeholder="Company name"
                                />
                              </div>
                              <div className="entry-field-group">
                                <div className="entry-field">
                                  <label>Start Year</label>
                                  <input 
                                    type="text" 
                                    value={job.yearStart || ''} 
                                    onChange={(e) => handleJobChange(index, 'yearStart', e.target.value)}
                                    placeholder="YYYY"
                                  />
                                </div>
                                <div className="entry-field">
                                  <label>End Year</label>
                                  <input 
                                    type="text" 
                                    value={job.yearEnd || ''} 
                                    onChange={(e) => handleJobChange(index, 'yearEnd', e.target.value)}
                                    placeholder="YYYY or Present"
                                  />
                                </div>
                              </div>
                              <div className="entry-field">
                                <label>Description</label>
                                <input
                                  type="text"
                                  value={job.description || ''}
                                  onChange={(e) => handleJobChange(index, 'description', e.target.value)}
                                  placeholder="Brief job description"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Job selector */}
                    {showJobSelector ? (
                      <div className="job-selector">
                        <div className="job-selector-header">
                          <h4>Select Role</h4>
                          <button 
                            type="button" 
                            className="close-button"
                            onClick={() => setShowJobSelector(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="job-selector-content">
                          {JOB_TYPES.map((jobType, index) => (
                            <button 
                              key={index} 
                              type="button" 
                              className="job-type-button"
                              onClick={() => handleSelectJob(jobType)}
                            >
                              {jobType}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="add-item-button"
                        onClick={() => setShowJobSelector(true)}
                      >
                      + Add job
                    </button>
                    )}
                  </div>

                  <div className="education-item">
                    <h3 className="subsection-title">Education</h3>
                    
                    {/* Display existing education */}
                    {user.education.length > 0 && (
                      <div className="education-list">
                        {user.education.map((edu, index) => (
                          <div key={index} className="education-entry">
                            <div className="entry-header">
                              <h4 className="entry-title">{edu.institution}</h4>
                              <button 
                                type="button" 
                                className="remove-button"
                                onClick={() => handleRemoveEducation(index)}
                              >
                                <FaTimes />
                              </button>
                            </div>
                            <p className="education-details">
                              {edu.degree} {edu.field && `in ${edu.field}`}
                              {(edu.startYear || edu.endYear) && ` (${edu.startYear || ''} - ${edu.endYear || ''})`}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education form */}
                    {showEducationForm ? (
                      <div className="education-form">
                        <div className="education-form-header">
                          <h4>Add Education</h4>
                          <button 
                            type="button" 
                            className="close-button"
                            onClick={() => setShowEducationForm(false)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="education-form-content">
                          <div className="education-field">
                            <label>Institution <span className="required-field">*</span></label>
                            <input 
                              type="text" 
                              name="institution"
                              value={newEducation.institution} 
                              onChange={handleEducationChange}
                              placeholder="School or University"
                              required
                            />
                          </div>
                          <div className="education-field">
                            <label>Degree <span className="required-field">*</span></label>
                            <input 
                              type="text" 
                              name="degree"
                              value={newEducation.degree} 
                              onChange={handleEducationChange}
                              placeholder="e.g. Bachelor's, Master's"
                              required
                            />
                          </div>
                          <div className="education-field">
                            <label>Field of Study</label>
                            <input 
                              type="text" 
                              name="field"
                              value={newEducation.field} 
                              onChange={handleEducationChange}
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div className="education-field-group">
                            <div className="education-field">
                              <label>Start Year</label>
                              <input 
                                type="text" 
                                name="startYear"
                                value={newEducation.startYear} 
                                onChange={handleEducationChange}
                                placeholder="YYYY"
                              />
                            </div>
                            <div className="education-field">
                              <label>End Year</label>
                              <input 
                                type="text" 
                                name="endYear"
                                value={newEducation.endYear} 
                                onChange={handleEducationChange}
                                placeholder="YYYY or Present"
                              />
                            </div>
                          </div>
                          <div className="education-field">
                            <label>Description</label>
                            <input
                              type="text"
                              name="description"
                              value={newEducation.description}
                              onChange={handleEducationChange}
                              placeholder="Brief education description"
                            />
                          </div>
                          <div className="education-form-actions">
                            <button 
                              type="button" 
                              className="save-education-button"
                              onClick={handleAddEducation}
                            >
                              Add Education
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="add-item-button"
                        onClick={() => setShowEducationForm(true)}
                      >
                      + Add education
                    </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="form-section">
                <h2 className="section-title">Contact Details</h2>

                <div className="contact-details-section">
                  <div className="form-group">
                    <div className="form-label-with-icon">
                      <FaEnvelope className="form-label-icon" />
                      <label htmlFor="workEmail" className="form-label">
                        Work Display Email
                      </label>
                    </div>
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={user.workEmail}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={user.phoneNumber}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="website" className="form-label">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={user.website}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customUrl" className="form-label">
                      Custom URL
                    </label>
                    <input
                      type="text"
                      id="customUrl"
                      name="customUrl"
                      value={user.customUrl}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-profile-button"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
