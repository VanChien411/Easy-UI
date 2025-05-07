import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BlogAuthor from './BlogAuthor';
import RelatedPosts from './RelatedPosts';
import './BlogPost.css';
import articleService from '../../../services/articleService';

// Icons for share buttons
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

export default function BlogPost() {
  const params = useParams();
  const id = params.slug;
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      // Check if ID exists and is valid
      if (!id) {
        console.error('Blog post ID is undefined or invalid');
        setError('Invalid blog post ID. Please try another article.');
        setLoading(false);
        return;
      }

      console.log('Attempting to fetch blog post with ID:', id);
      
      try {
        setLoading(true);
        const fetchedPost = await articleService.getById(id);
        console.log('Successfully fetched blog post:', fetchedPost);
        setPost(fetchedPost);
      } catch (error) {
        console.error(`Error fetching blog post with ID ${id}:`, error);
        if (error.response && error.response.status === 400) {
          setError('The article ID format is invalid. Please try another article.');
        } else if (error.response && error.response.status === 404) {
          setError('This article was not found. It may have been removed or does not exist.');
        } else {
          setError('Failed to load blog post. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Handle share functionality
  const handleShare = (platform) => {
    if (!post) return;
    
    const url = window.location.href;
    const title = post.title;
    
    switch(platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
        break;
      default:
        break;
    }
  };

  // If post is loading, show loading state
  if (loading) {
    return (
      <div className="blog-post-loading">
        <p>Loading article...</p>
      </div>
    );
  }

  // If error occurred, show error state
  if (error) {
    return (
      <div className="blog-post-error">
        <p>{error}</p>
        <div style={{ marginTop: "20px" }}>
          <Link to="/blog" className="blog-back-button">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // If post not found, show 404
  if (!post) {
    return (
      <div className="blog-post-not-found">
        <h1>Article Not Found</h1>
        <p>Sorry, the blog post you're looking for doesn't exist or has been moved.</p>
        <div style={{ marginTop: "20px" }}>
          <Link to="/blog" className="blog-back-button">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Parse content from HTML
  const renderContent = () => {
    if (!post.content) return null;
    
    return (
      <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    );
  };

  return (
    <article className="blog-post-container">
      {/* Back to blog link */}
      <div className="blog-back-link">
        <Link to="/blog" className="blog-back-button">
          <ArrowLeftIcon />
          <span>Back to all stories</span>
        </Link>
      </div>

      {/* Post header */}
      <header className="blog-post-header">
        <div className="blog-post-date">{post.getFormattedPublishedDate('medium')}</div>
        <h1 className="blog-post-title">{post.title}</h1>
        {post.shortDescription && <p className="blog-post-subtitle">{post.shortDescription}</p>}
      </header>

      {/* Featured image */}
      {post.imageUrl && (
        <div className="blog-post-featured-image">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="featured-image"
            style={{ maxHeight: "280px", objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      )}

      {/* Post content */}
      {renderContent()}

      {/* Share links */}
      <div className="blog-post-share">
        <div className="blog-post-share-text">Share this article</div>
        <div className="blog-post-share-buttons">
          <button 
            className="blog-post-share-button" 
            aria-label="Share on Twitter"
            onClick={() => handleShare('twitter')}
          >
            <TwitterIcon />
          </button>
          <button 
            className="blog-post-share-button" 
            aria-label="Share on Facebook"
            onClick={() => handleShare('facebook')}
          >
            <FacebookIcon />
          </button>
          <button 
            className="blog-post-share-button" 
            aria-label="Share on LinkedIn"
            onClick={() => handleShare('linkedin')}
          >
            <LinkedinIcon />
          </button>
          <button 
            className="blog-post-share-button" 
            aria-label="Copy link"
            onClick={() => handleShare('copy')}
          >
            <LinkIcon />
          </button>
        </div>
      </div>

      {/* Author info */}
      {post.author && <BlogAuthor author={post.author} />}

      {/* Related posts - With future API endpoint for related posts */}
      <RelatedPosts currentPostId={post.id} />
    </article>
  );
} 