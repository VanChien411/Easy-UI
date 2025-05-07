import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';
import articleService from '../../../services/articleService';

export default function BlogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await articleService.getAll(pageNumber, pageSize);
        setBlogPosts(prevPosts => pageNumber === 1 ? 
          response.items : 
          [...prevPosts, ...response.items]
        );
        setHasMore(response.hasNextPage());
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [pageNumber, pageSize]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPageNumber(prevPage => prevPage + 1);
    }
  };

  if (error) {
    return (
      <div className="blog-page">
        <div className="blog-container">
          <h1 className="blog-main-title">Stories—the Design Blog by Easy UI</h1>
          <div className="blog-error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1 className="blog-main-title">Stories—the Design Blog by Easy UI</h1>

        <div className="blog-posts-list">
          {blogPosts.length > 0 ? (
            blogPosts.map((post, index) => (
              <div key={post.id} className="blog-post">
                <div className="blog-post-date">{post.getFormattedPublishedDate('medium')}</div>
                <h2 className="blog-post-title">
                  <Link to={`/blog/${post.id}`} className="blog-post-title-link">
                    {post.title}
                  </Link>
                </h2>
                <p className="blog-post-excerpt">{post.shortDescription}</p>
                <Link to={`/blog/${post.id}`} className="blog-post-read-more">
                  Read more
                </Link>
                {index < blogPosts.length - 1 && <hr className="blog-post-divider" />}
              </div>
            ))
          ) : !loading && (
            <div className="blog-no-posts">
              <p>No blog posts found.</p>
            </div>
          )}
          
          {loading && pageNumber === 1 && (
            <div className="blog-loading">Loading posts...</div>
          )}
        </div>

        {hasMore && (
          <div className="blog-load-more">
            <button 
              className="blog-load-more-button" 
              onClick={handleLoadMore} 
              disabled={loading}
            >
              {loading && pageNumber > 1 ? 'Loading more...' : 'Load more stories'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 