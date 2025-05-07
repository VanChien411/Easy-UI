import React from 'react';
import { Link } from 'react-router-dom';
import './BlogAuthor.css';

const BlogAuthor = ({ author }) => {
  if (!author) return null;

  return (
    <div className="blog-author">
      <div className="blog-author-content">
        <div className="blog-author-avatar-container">
          <img
            src={author.getProfilePicture()}
            alt={author.getDisplayName()}
            className="blog-author-avatar"
          />
        </div>
        <div className="blog-author-info">
          <h3 className="blog-author-name">
            <Link to={author.getProfileUrl()} className="blog-author-link">
              {author.getDisplayName()}
            </Link>
          </h3>
          {author.role && <p className="blog-author-role">{author.role}</p>}
        </div>
      </div>
      {author.bio && <p className="blog-author-bio">{author.bio}</p>}
    </div>
  );
};

export default BlogAuthor; 