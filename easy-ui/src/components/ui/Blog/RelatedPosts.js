import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RelatedPosts.css';
import articleService from '../../../services/articleService';

const RelatedPosts = ({ currentPostId }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        setLoading(true);
        // For now, we'll use the latest posts as related posts
        // In a real app, you would have an API endpoint for actual related posts
        const posts = await articleService.getLatest(4);
        // Filter out the current post if it's in the latest posts
        const filteredPosts = posts.filter(post => post.id !== currentPostId);
        // Limit to 3 posts
        setRelatedPosts(filteredPosts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching related posts:', error);
        setError('Failed to load related posts.');
      } finally {
        setLoading(false);
      }
    };

    if (currentPostId) {
      fetchRelatedPosts();
    }
  }, [currentPostId]);

  if (loading) {
    return <div className="related-posts-loading">Loading related posts...</div>;
  }

  if (error) {
    return null; // Don't show an error for related posts, just don't display them
  }

  if (relatedPosts.length === 0) {
    return null; // Don't show related posts section if none are available
  }

  return (
    <div className="related-posts">
      <h2 className="related-posts-title">You might also like</h2>
      <div className="related-posts-grid">
        {relatedPosts.map((post) => (
          <div key={post.id} className="related-post-card">
            <Link to={`/blog/${post.id}`} className="related-post-link">
              {post.imageUrl && (
                <div className="related-post-image-container">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="related-post-image"
                    style={{ maxHeight: "140px", objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              )}
              <div className="related-post-date">{post.getFormattedPublishedDate('medium')}</div>
              <h3 className="related-post-title">{post.title}</h3>
              <p className="related-post-excerpt">{post.shortDescription}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts; 