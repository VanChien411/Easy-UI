import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './BlogTagPage.css';

export default function BlogTagPage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag.replace(/-/g, " "));

  // Mock blog posts data - in a real app, you would filter posts by tag
  const blogPosts = [
    {
      id: 1,
      slug: "pushing-boundaries-logo-design",
      date: "APR 8, 2025",
      title: "Pushing the Boundaries of Logo Design Through Storytelling and Expression",
      excerpt:
        "We talked to Brazilian graphic designer Breno Bitencourt, who is known for his bold, expressive logo designs that push traditional design boundaries.",
      image: "/placeholder.svg",
      tags: ["Logo Design", "Branding", "Storytelling", "Creative Process"],
    },
    {
      id: 2,
      slug: "what-makes-great-icon-set",
      date: "MAR 24, 2025",
      title: "What Makes a Great Icon Set?",
      excerpt: "Learn how to create a cohesive and unified icon set with these tips from Noun Project.",
      image: "/placeholder.svg",
      tags: ["Icons", "UI Design", "Visual Systems", "Design Principles"],
    },
    {
      id: 4,
      slug: "designing-for-accessibility",
      date: "MAR 10, 2025",
      title: "Designing for Accessibility: Best Practices and Tools",
      excerpt:
        "Explore how to create inclusive designs that work for everyone, with practical tips and resources for implementing accessibility in your projects.",
      image: "/placeholder.svg",
      tags: ["Accessibility", "UI Design", "UX Design", "Inclusive Design"],
    },
  ];

  // Filter posts by tag
  const filteredPosts = blogPosts.filter(
    (post) => post.tags && post.tags.some((t) => t.toLowerCase() === decodedTag.toLowerCase()),
  );

  return (
    <div className="blog-tag-page">
      <div className="blog-tag-container">
        <div className="blog-tag-header">
          <div className="blog-tag-label">Tagged in</div>
          <h1 className="blog-tag-title">{decodedTag}</h1>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="blog-tag-posts-list">
            {filteredPosts.map((post) => (
              <div key={post.id} className="blog-tag-post-item">
                <article className="blog-tag-post">
                  <div className="blog-tag-post-image-container">
                    <Link to={`/blog/${post.slug}`} className="blog-tag-post-image-link">
                      <div className="blog-tag-post-image-wrapper">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="blog-tag-post-image"
                          style={{ maxHeight: "160px", objectFit: "cover", objectPosition: "center" }}
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="blog-tag-post-content">
                    <div className="blog-tag-post-date">{post.date}</div>
                    <h2 className="blog-tag-post-title">
                      <Link to={`/blog/${post.slug}`} className="blog-tag-post-title-link">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="blog-tag-post-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.slug}`} className="blog-tag-post-read-more">
                      Read more
                    </Link>
                  </div>
                </article>
                {post.id !== filteredPosts[filteredPosts.length - 1].id && <hr className="blog-tag-post-divider" />}
              </div>
            ))}
          </div>
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