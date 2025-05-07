import React from 'react';
import './BlogAuthor.css';

const BlogAuthor = ({ author }) => {
  if (!author) return null;

  return (
    <div className="blog-author">
      <div className="blog-author-content">
        <div className="blog-author-avatar-container">
          <img
            src={author.avatar || "/placeholder.svg"}
            alt={author.name}
            className="blog-author-avatar"
          />
        </div>
        <div className="blog-author-info">
          <h3 className="blog-author-name">{author.name}</h3>
          {author.role && <p className="blog-author-role">{author.role}</p>}
        </div>
      </div>
      {author.bio && <p className="blog-author-bio">{author.bio}</p>}
    </div>
  );
};

export default BlogAuthor; 