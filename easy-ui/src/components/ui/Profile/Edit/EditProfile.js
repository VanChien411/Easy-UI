import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaEnvelope, FaTimes } from "react-icons/fa";
import useAuth from "../../../../hooks/useAuth";
import userManagerService from "../../../../services/usermanagerService";
import { showSuccessAlert, showErrorAlert } from "../../../../utils/alertUtils";
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
    
    // Hide the education form after adding
    setShowEducationForm(false);
  };

  // Handle removing education
  const handleRemoveEducation = (index) => {
    setUser(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Profile image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      showErrorAlert("Please upload only JPEG or PNG images");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showErrorAlert("File size should not exceed 2MB");
      return;
    }

    try {
      const result = await userManagerService.uploadProfilePicture(file);
      setUser(prev => ({
        ...prev,
        avatar: result.avatarUrl || prev.avatar
      }));
      showSuccessAlert("Profile picture updated successfully");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      showErrorAlert("Failed to upload profile picture. Please try again.");
    }
  };

  // Profile image remove handler
  const handleRemoveImage = async () => {
    if (window.confirm("Are you sure you want to remove your profile picture?")) {
      try {
        await userManagerService.removeProfilePicture();
        setUser(prev => ({
          ...prev,
          avatar: "/placeholder.svg?height=100&width=100"
        }));
        showSuccessAlert("Profile picture removed successfully");
      } catch (error) {
        console.error("Failed to remove profile picture:", error);
        showErrorAlert("Failed to remove profile picture. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div className="loading-indicator"></div>;
  }

  return (
    <div className="edit-profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <img
              src={user.avatar}
              alt={user.name}
              className="profile-avatar"
            />
          </div>

          <h1 className="profile-name">
            {user.name} <span className="profile-subheading">/ Edit Profile</span>
          </h1>
          <p className="profile-bio">Set up your Easy UI presence and profile information</p>
        </div>

        <div className="edit-profile-layout">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <h2 className="sidebar-heading">ACCOUNT</h2>
            <div className="sidebar-links">
              <Link to="/profile/edit" className="sidebar-nav-item active">
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
            </div>

            <div className="delete-account-section">
              <Link to="/profile/delete" className="delete-account-link">
                Delete Account
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="edit-profile-content">
            <form onSubmit={handleSubmit}>
              {/* Profile Picture */}
              <div className="profile-picture-section edit-profile-card">
                <h2 className="section-title">Profile Picture</h2>
                <div className="profile-picture-container">
                  <div className="profile-picture-wrapper">
                    <img src={user.avatar} alt={user.name} className="profile-picture" />
                  </div>
                  <div className="profile-picture-actions">
                    <label className="profile-picture-button">
                      Upload new picture
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                    <button
                      type="button"
                      className="profile-picture-button"
                      onClick={handleRemoveImage}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="basic-info-section edit-profile-card">
                <h2 className="section-title">Basic Info</h2>
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
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="form-label-with-counter">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <span className="form-counter">{user.bio.length}/160</span>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={user.bio}
                    onChange={handleChange}
                    className="form-textarea"
                    maxLength="160"
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="location" className="form-label">Location</label>
                  <div className="form-input-with-icon">
                    <FaSearch className="form-input-icon" />
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={user.location}
                      onChange={handleChange}
                      className="form-input with-icon"
                      placeholder="Enter location"
                    />
                  </div>
                </div>
              </div>

              {/* Work & Education */}
              <div className="work-education-section edit-profile-card">
                <h2 className="section-title">Work & Education</h2>
                
                {/* Work History */}
                <div className="work-history">
                  <h3 className="subsection-title">Work History</h3>
                  
                  {showJobSelector && (
                    <div className="job-selector">
                      <div className="job-selector-header">
                        <h4>Select Job Type</h4>
                        <button 
                          type="button" 
                          className="close-button"
                          onClick={() => setShowJobSelector(false)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="job-selector-content">
                        {JOB_TYPES.map((job, index) => (
                          <button
                            key={index}
                            type="button"
                            className="job-type-button"
                            onClick={() => handleSelectJob(job)}
                          >
                            {job}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="work-history-list">
                    {user.workHistory.map((job, index) => (
                      <div key={index} className="work-history-entry">
                        <div className="entry-header">
                          <h4 className="entry-title">{job.title || "New Position"}</h4>
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
                            <label>Job Title</label>
                            <input 
                              type="text"
                              value={job.title}
                              onChange={(e) => handleJobChange(index, 'title', e.target.value)}
                              placeholder="e.g. Product Designer"
                            />
                          </div>
                          <div className="entry-field">
                            <label>Company</label>
                            <input 
                              type="text"
                              value={job.company}
                              onChange={(e) => handleJobChange(index, 'company', e.target.value)}
                              placeholder="e.g. Easy UI"
                            />
                          </div>
                          <div className="entry-field-group">
                            <div className="entry-field">
                              <label>Start Year</label>
                              <input 
                                type="text"
                                value={job.yearStart}
                                onChange={(e) => handleJobChange(index, 'yearStart', e.target.value)}
                                placeholder="e.g. 2020"
                              />
                            </div>
                            <div className="entry-field">
                              <label>End Year</label>
                              <input 
                                type="text"
                                value={job.yearEnd}
                                onChange={(e) => handleJobChange(index, 'yearEnd', e.target.value)}
                                placeholder="e.g. 2023 or Present"
                              />
                            </div>
                          </div>
                          <div className="entry-field">
                            <label>Description</label>
                            <input 
                              type="text"
                              value={job.description}
                              onChange={(e) => handleJobChange(index, 'description', e.target.value)}
                              placeholder="Brief description of your role"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    className="add-item-button"
                    onClick={() => setShowJobSelector(true)}
                  >
                    + Add Work Experience
                  </button>
                </div>
                
                {/* Education */}
                <div className="education">
                  <h3 className="subsection-title">Education</h3>
                  
                  <div className="education-list">
                    {user.education.map((edu, index) => (
                      <div key={index} className="work-history-entry education-entry">
                        <div className="entry-header">
                          <h4 className="entry-title">{edu.institution || "New Education"}</h4>
                          <button 
                            type="button"
                            className="remove-button"
                            onClick={() => handleRemoveEducation(index)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="education-details">
                          <p><strong>{edu.degree}</strong>{edu.field ? ` in ${edu.field}` : ""}</p>
                          <p>{edu.startYear} - {edu.endYear}</p>
                          {edu.description && <p>{edu.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {showEducationForm && (
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
                            placeholder="e.g. Stanford University"
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
                            placeholder="e.g. Bachelor's"
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
                              placeholder="e.g. 2018"
                            />
                          </div>
                          <div className="education-field">
                            <label>End Year</label>
                            <input 
                              type="text"
                              name="endYear"
                              value={newEducation.endYear}
                              onChange={handleEducationChange}
                              placeholder="e.g. 2022 or Present"
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
                            placeholder="Brief description of your studies"
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
                  )}
                  
                  {!showEducationForm && (
                    <button
                      type="button"
                      className="add-item-button"
                      onClick={() => setShowEducationForm(true)}
                    >
                      + Add Education
                    </button>
                  )}
                </div>
              </div>
              
              {/* Contact Details */}
              <div className="contact-details-section edit-profile-card">
                <h2 className="section-title">Contact Details</h2>
                
                <div className="form-group">
                  <label htmlFor="workEmail" className="form-label">
                    Work Email
                  </label>
                  <div className="form-input-with-icon">
                    <FaEnvelope className="form-input-icon" />
                    <input
                      type="email"
                      id="workEmail"
                      name="workEmail"
                      value={user.workEmail}
                      onChange={handleChange}
                      className="form-input with-icon"
                    />
                  </div>
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
                    placeholder="+1 (555) 123-4567"
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
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="save-profile-button"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
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
