import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

export default function BlogPage() {
  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      slug: "pushing-boundaries-logo-design",
      date: "APR 8, 2025",
      title: "Pushing the Boundaries of Logo Design Through Storytelling and Expression",
      excerpt:
        "We talked to Brazilian graphic designer Breno Bitencourt, who is known for his bold, expressive logo designs that push traditional design boundaries.",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      slug: "what-makes-great-icon-set",
      date: "MAR 24, 2025",
      title: "What Makes a Great Icon Set?",
      excerpt: "Learn how to create a cohesive and unified icon set with these tips from Noun Project.",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      slug: "work-in-progress-part-9",
      date: "MAR 17, 2025",
      title: "Work In Progress, Part 9 🚧",
      excerpt:
        "Dribbble's mission is to help professional designers earn a living doing work they take pride in, and the Dribbble team is responsible for managing the business in a way that ensures it can continue fulfilling that mission long-term.",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      slug: "designing-for-accessibility",
      date: "MAR 10, 2025",
      title: "Designing for Accessibility: Best Practices and Tools",
      excerpt:
        "Explore how to create inclusive designs that work for everyone, with practical tips and resources for implementing accessibility in your projects.",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      slug: "color-theory-for-digital-designers",
      date: "FEB 28, 2025",
      title: "Color Theory for Digital Designers: Beyond the Basics",
      excerpt:
        "Dive deeper into color psychology, cultural considerations, and advanced color harmony techniques to elevate your digital design projects.",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      slug: "typography-trends-2025",
      date: "FEB 15, 2025",
      title: "Typography Trends to Watch in 2025",
      excerpt:
        "From variable fonts to experimental letterforms, discover the typography trends that are shaping the design landscape this year.",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="blog-page">
      <div className="blog-container">
        <h1 className="blog-main-title">Stories—the Design Blog by Easy UI</h1>

        <div className="blog-posts-list">
          {blogPosts.map((post, index) => (
            <div key={post.id} className="blog-post">
              <div className="blog-post-date">{post.date}</div>
              <h2 className="blog-post-title">
                <Link to={`/blog/${post.slug}`} className="blog-post-title-link">
                  {post.title}
                </Link>
              </h2>
              <p className="blog-post-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blog-post-read-more">
                Read more
              </Link>
              {index < blogPosts.length - 1 && <hr className="blog-post-divider" />}
            </div>
          ))}
        </div>

        <div className="blog-load-more">
          <button className="blog-load-more-button">
            Load more stories
          </button>
        </div>
      </div>
    </div>
  );
} 