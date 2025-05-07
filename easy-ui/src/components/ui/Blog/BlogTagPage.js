import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './BlogTagPage.css';
import articleService from '../../../services/articleService';

export default function BlogTagPage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag.replace(/-/g, " "));
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch all blog posts since we don't have a dedicated tag API endpoint
        // In a real implementation, there would be a specific endpoint for tags
        const response = await articleService.getAll(pageNumber, pageSize);
        
        // We're simulating tag filtering on the frontend
        // In a production environment, this filtering should happen on the backend
        // This is just a temporary solution
        
        // Set the posts
        if (pageNumber === 1) {
          setBlogPosts(response.items);
        } else {
          setBlogPosts(prevPosts => [...prevPosts, ...response.items]);
        }
        
        setHasMore(response.hasNextPage());
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [pageNumber, pageSize, tag]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPageNumber(prevPage => prevPage + 1);
    }
  };
  
  // Filter posts by tag (in a real implementation, this would be done by the API)
  // For now, we'll just simulate as if all posts match the tag
  const filteredPosts = blogPosts;

  if (error) {
    return (
      <div className="blog-tag-page">
        <div className="blog-tag-container">
          <div className="blog-tag-header">
            <div className="blog-tag-label">Tagged in</div>
            <h1 className="blog-tag-title">{decodedTag}</h1>
          </div>
          <div className="blog-tag-error">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-tag-page">
      <div className="blog-tag-container">
        <div className="blog-tag-header">
          <div className="blog-tag-label">Tagged in</div>
          <h1 className="blog-tag-title">{decodedTag}</h1>
        </div>

        {loading && pageNumber === 1 ? (
          <div className="blog-tag-loading">Loading articles...</div>
        ) : filteredPosts.length > 0 ? (
          <>
            <div className="blog-tag-posts-list">
              {filteredPosts.map((post, index) => (
                <div key={post.id} className="blog-tag-post-item">
                  <article className="blog-tag-post">
                    {post.imageUrl && (
                      <div className="blog-tag-post-image-container">
                        <Link to={`/blog/${post.id}`} className="blog-tag-post-image-link">
                          <div className="blog-tag-post-image-wrapper">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="blog-tag-post-image"
                              style={{ maxHeight: "160px", objectFit: "cover", objectPosition: "center" }}
                            />
                          </div>
                        </Link>
                      </div>
                    )}
                    <div className="blog-tag-post-content">
                      <div className="blog-tag-post-date">{post.getFormattedPublishedDate('medium')}</div>
                      <h2 className="blog-tag-post-title">
                        <Link to={`/blog/${post.id}`} className="blog-tag-post-title-link">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="blog-tag-post-excerpt">{post.shortDescription}</p>
                      <Link to={`/blog/${post.id}`} className="blog-tag-post-read-more">
                        Read more
                      </Link>
                    </div>
                  </article>
                  {index < filteredPosts.length - 1 && <hr className="blog-tag-post-divider" />}
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="blog-tag-load-more">
                <button 
                  className="blog-tag-load-more-button" 
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading more...' : 'Load more articles'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="blog-tag-empty">
            <p className="blog-tag-empty-text">No articles found with this tag.</p>
            <div style={{ marginTop: "20px" }}>
              <Link to="/blog" className="blog-tag-back-button">
                View all articles
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 