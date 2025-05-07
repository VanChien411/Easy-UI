import React from 'react';
import { Link } from 'react-router-dom';
import './RelatedPosts.css';

const RelatedPosts = ({ currentPostId }) => {
  // Mock related posts data
  const relatedPosts = [
    {
      id: 101,
      slug: "design-systems-for-startups",
      title: "Design Systems for Startups: When and How to Get Started",
      excerpt: "Learn when your startup needs a design system and how to implement one without slowing down your team.",
      image: "/placeholder.svg",
      date: "MAR 5, 2025",
    },
    {
      id: 102,
      slug: "typography-trends-2025",
      title: "Typography Trends to Watch in 2025",
      excerpt:
        "From variable fonts to experimental letterforms, discover the typography trends that are shaping the design landscape this year.",
      image: "/placeholder.svg",
      date: "FEB 15, 2025",
    },
    {
      id: 103,
      slug: "designing-for-accessibility",
      title: "Designing for Accessibility: Best Practices and Tools",
      excerpt:
        "Explore how to create inclusive designs that work for everyone, with practical tips and resources for implementing accessibility in your projects.",
      image: "/placeholder.svg",
      date: "MAR 10, 2025",
    },
  ];

  // Filter out the current post if it's in the related posts
  const filteredPosts = relatedPosts.filter((post) => post.id !== currentPostId);

  return (
    <div className="related-posts">
      <h2 className="related-posts-title">You might also like</h2>
      <div className="related-posts-grid">
        {filteredPosts.map((post) => (
          <div key={post.id} className="related-post-card">
            <Link to={`/blog/${post.slug}`} className="related-post-link">
              <div className="related-post-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="related-post-image"
                  style={{ maxHeight: "140px", objectFit: "cover", objectPosition: "center" }}
                />
              </div>
              <div className="related-post-date">{post.date}</div>
              <h3 className="related-post-title">{post.title}</h3>
              <p className="related-post-excerpt">{post.excerpt}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts; 