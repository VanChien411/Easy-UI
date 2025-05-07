import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BlogAuthor from './BlogAuthor';
import RelatedPosts from './RelatedPosts';
import './BlogPost.css';

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
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the blog post by slug
  const post = getBlogPostBySlug(slug);

  // If post not found, show 404
  if (!post) {
    // You can create a separate NotFound component or redirect to a 404 page
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

  // Handle share functionality
  const handleShare = (platform) => {
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
        <div className="blog-post-date">{post.date}</div>
        <h1 className="blog-post-title">{post.title}</h1>
        {post.subtitle && <p className="blog-post-subtitle">{post.subtitle}</p>}
      </header>

      {/* Featured image */}
      <div className="blog-post-featured-image">
        <img
          src={post.featuredImage || "/placeholder.svg"}
          alt={post.title}
          className="featured-image"
          style={{ maxHeight: "280px", objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* Post content */}
      <div className="blog-post-content">
        {post.content.map((section, index) => {
          if (section.type === "paragraph") {
            return (
              <p key={index} className="blog-post-paragraph">
                {section.content}
              </p>
            );
          } else if (section.type === "heading") {
            return (
              <h2 key={index} className="blog-post-heading">
                {section.content}
              </h2>
            );
          } else if (section.type === "image") {
            return (
              <figure key={index} className="blog-post-figure">
                <div className="blog-post-image-container">
                  <img
                    src={section.url || "/placeholder.svg"}
                    alt={section.alt || ""}
                    className="blog-post-image"
                    style={{ maxHeight: "220px", objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
                {section.caption && (
                  <figcaption className="blog-post-caption">{section.caption}</figcaption>
                )}
              </figure>
            );
          } else if (section.type === "quote") {
            return (
              <blockquote key={index} className="blog-post-quote">
                <p>{section.content}</p>
                {section.author && <cite>— {section.author}</cite>}
              </blockquote>
            );
          } else if (section.type === "list") {
            return (
              <ul key={index} className="blog-post-list">
                {section.items.map((item, i) => (
                  <li key={i} className="blog-post-list-item">
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>

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
      <BlogAuthor author={post.author} />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="blog-post-tags">
          <div className="blog-post-tags-label">Tagged in</div>
          <div className="blog-post-tags-list">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="blog-post-tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related posts */}
      <RelatedPosts currentPostId={post.id} />
    </article>
  );
}

// Helper function to get blog post by slug
function getBlogPostBySlug(slug) {
  // This would typically come from a database or API
  const blogPosts = [
    {
      id: 1,
      slug: "pushing-boundaries-logo-design",
      date: "APR 8, 2025",
      title: "Pushing the Boundaries of Logo Design Through Storytelling and Expression",
      subtitle: "How narrative elements and emotional expression are transforming modern logo design",
      excerpt:
        "We talked to Brazilian graphic designer Breno Bitencourt, who is known for his bold, expressive logo designs that push traditional design boundaries.",
      featuredImage: "/placeholder.svg",
      author: {
        name: "Sarah Johnson",
        role: "Design Writer",
        avatar: "/placeholder.svg",
        bio: "Sarah is a design writer with over 10 years of experience in the creative industry. She specializes in logo design, branding, and visual identity systems.",
      },
      tags: ["Logo Design", "Branding", "Storytelling", "Creative Process"],
      content: [
        {
          type: "paragraph",
          content:
            "In the ever-evolving world of logo design, some designers are pushing beyond the conventional boundaries of minimalism and simplicity to create logos that tell stories, evoke emotions, and express complex brand narratives. One such designer is Breno Bitencourt, a Brazilian graphic designer whose work challenges traditional notions of what a logo can be.",
        },
        {
          type: "paragraph",
          content:
            "Bitencourt's approach to logo design is deeply rooted in storytelling and expression. His designs often incorporate narrative elements, cultural references, and emotional cues that give brands a distinctive voice in crowded markets.",
        },
        {
          type: "heading",
          content: "Breaking Away from Minimalism",
        },
        {
          type: "paragraph",
          content:
            'While minimalism has dominated logo design trends for the past decade, Bitencourt believes there\'s room for more expressive approaches. "Minimalism serves a purpose, and it works beautifully for many brands," he explains. "But not every brand needs to communicate simplicity and efficiency. Some brands need to express passion, creativity, or cultural richness, and that\'s where more complex design approaches can shine."',
        },
        {
          type: "image",
          url: "/placeholder.svg",
          alt: "Example of Breno Bitencourt's expressive logo design",
          caption: "One of Bitencourt's logo designs showcasing narrative elements and cultural references",
        },
        {
          type: "paragraph",
          content:
            "His work often features intricate details, bold typography, and elements that transform when viewed from different perspectives. These designs invite viewers to spend time with them, discovering new details and meanings with each look.",
        },
        {
          type: "quote",
          content:
            "A logo doesn't always need to be immediately understood. Sometimes, the most powerful logos are those that reveal themselves slowly, creating a deeper connection with the audience over time.",
          author: "Breno Bitencourt",
        },
        {
          type: "heading",
          content: "The Role of Cultural Context",
        },
        {
          type: "paragraph",
          content:
            "Bitencourt's work is heavily influenced by Brazilian culture, with its rich visual language, diverse influences, and vibrant energy. He believes that cultural context can add depth and authenticity to logo design, creating work that feels genuine rather than generic.",
        },
        {
          type: "paragraph",
          content:
            '"When you incorporate cultural elements into a logo, you\'re not just creating a visual mark—you\'re telling a story about where a brand comes from, what it values, and how it sees the world," he says. "That story can be incredibly powerful in building connections with audiences."',
        },
        {
          type: "heading",
          content: "Practical Applications for Brands",
        },
        {
          type: "paragraph",
          content:
            "While Bitencourt's approach might seem best suited to artistic or cultural brands, he argues that elements of storytelling and expression can benefit brands across industries. The key is finding the right balance between clarity and complexity.",
        },
        {
          type: "list",
          items: [
            "Consider what emotional response you want your logo to evoke, not just what information you want it to convey",
            "Look for narrative elements that connect to your brand's history, values, or mission",
            "Don't be afraid of complexity if it serves a purpose in expressing your brand's identity",
            "Ensure your logo works across contexts while maintaining its expressive qualities",
            "Test how your audience responds to more expressive logo designs",
          ],
        },
        {
          type: "paragraph",
          content:
            "As brands seek to stand out in increasingly crowded digital spaces, Bitencourt's approach offers a compelling alternative to the prevailing minimalism. By embracing storytelling, cultural context, and emotional expression, logos can become more than just identifiers—they can become powerful tools for connection and communication.",
        },
        {
          type: "paragraph",
          content:
            'For designers looking to push boundaries in their own work, Bitencourt offers this advice: "Study the rules so you know how to break them effectively. Understand why minimalism works, and then explore how different approaches might work even better for specific brands and contexts. Most importantly, never stop experimenting."',
        },
      ],
    },
    {
      id: 2,
      slug: "what-makes-great-icon-set",
      date: "MAR 24, 2025",
      title: "What Makes a Great Icon Set?",
      subtitle: "Principles and practices for creating cohesive, effective icon systems",
      excerpt: "Learn how to create a cohesive and unified icon set with these tips from Noun Project.",
      featuredImage: "/placeholder.svg",
      author: {
        name: "Michael Chen",
        role: "UI Designer",
        avatar: "/placeholder.svg",
        bio: "Michael is a UI designer specializing in icon systems and visual communication. He has created icon sets for major tech companies and design systems.",
      },
      tags: ["Icons", "UI Design", "Visual Systems", "Design Principles"],
      content: [
        {
          type: "paragraph",
          content:
            "Icons are the quiet workhorses of user interface design. When done well, they communicate complex ideas instantly, guide users through interfaces, and add visual interest without demanding attention. But creating a truly great icon set requires more than just design skill—it requires systematic thinking and a deep understanding of visual communication principles.",
        },
        {
          type: "paragraph",
          content:
            "We spoke with the team at Noun Project, who have curated one of the world's largest collections of icons, to understand what separates exceptional icon sets from merely adequate ones.",
        },
        {
          type: "heading",
          content: "Consistency is Key",
        },
        {
          type: "paragraph",
          content:
            'According to Edward Boatman, co-founder of Noun Project, consistency is the foundation of any successful icon set. "The most common mistake we see is inconsistency in style, weight, perspective, or metaphors," he explains. "Even if individual icons look great on their own, they\'ll fail as a set if they don\'t share a visual language."',
        },
        {
          type: "list",
          items: [
            "Maintain consistent stroke weights throughout your icon set",
            "Use a consistent corner radius for all rounded elements",
            "Establish a consistent level of detail and complexity",
            "Apply the same perspective across all icons (front view, 3/4 view, etc.)",
            "Use a consistent grid system for sizing and positioning elements",
          ],
        },
      ],
    },
    {
      id: 3,
      slug: "work-in-progress-part-9",
      date: "MAR 17, 2025",
      title: "Work In Progress, Part 9 🚧",
      subtitle: "Updates on Dribbble's mission and business development",
      excerpt:
        "Dribbble's mission is to help professional designers earn a living doing work they take pride in, and the Dribbble team is responsible for managing the business in a way that ensures it can continue fulfilling that mission long-term.",
      featuredImage: "/placeholder.svg",
      author: {
        name: "Zack Onisko",
        role: "CEO at Dribbble",
        avatar: "/placeholder.svg",
        bio: "Zack is the CEO of Dribbble, focused on building products and services that help designers grow their careers and connect with opportunities.",
      },
      tags: ["Dribbble Updates", "Business", "Design Community"],
      content: [
        {
          type: "paragraph",
          content:
            "Welcome to the ninth installment of Work in Progress, our series of updates on Dribbble's business and our ongoing efforts to better serve the design community. As always, we're committed to transparency about our direction and the decisions that affect our community.",
        },
        {
          type: "heading",
          content: "Our Mission and Values",
        },
        {
          type: "paragraph",
          content:
            "Before diving into specific updates, I want to reaffirm Dribbble's core mission: to help professional designers earn a living doing work they take pride in. This mission guides every decision we make, from product development to business partnerships.",
        },
      ],
    },
  ];

  return blogPosts.find((post) => post.slug === slug);
} 