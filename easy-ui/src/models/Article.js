import { formatDate } from '../utils/dateUtils';
import UserSummary from './UserSummary';

/**
 * Article model that represents an article in the system
 */
class Article {
  /**
   * @param {Object} params - Article parameters
   * @param {string} params.id - Article ID
   * @param {string} params.title - Article title
   * @param {string} params.shortDescription - Brief description of the article
   * @param {string} params.description - Full description of the article
   * @param {string} params.content - HTML content of the article
   * @param {string} params.imageUrl - URL to the article's featured image
   * @param {Date} params.createdAt - When the article was created
   * @param {Date} params.updatedAt - When the article was last updated
   * @param {Date|null} params.publishedAt - When the article was published (null if unpublished)
   * @param {string} params.authorId - ID of the author
   * @param {UserSummary|null} params.author - Author information
   * @param {number} params.viewCount - Number of article views
   */
  constructor({
    id = '',
    title = '',
    shortDescription = '',
    description = '',
    content = '',
    imageUrl = '',
    createdAt = new Date(),
    updatedAt = new Date(),
    publishedAt = null,
    authorId = '',
    author = null,
    viewCount = 0
  }) {
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.description = description;
    this.content = content;
    this.imageUrl = imageUrl;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    this.publishedAt = publishedAt ? (publishedAt instanceof Date ? publishedAt : new Date(publishedAt)) : null;
    this.authorId = authorId;
    this.author = author instanceof UserSummary ? author : author ? new UserSummary(author) : null;
    this.viewCount = viewCount;
  }

  /**
   * Create an Article from an API response
   * @param {Object} apiResponse - Response from the API
   * @returns {Article} - Article instance
   */
  static fromApiResponse(apiResponse) {
    return new Article({
      ...apiResponse,
      author: apiResponse.author ? UserSummary.fromApiResponse(apiResponse.author) : null
    });
  }

  /**
   * Get formatted creation date
   * @param {string} format - Format to use (optional)
   * @returns {string} - Formatted date string
   */
  getFormattedCreatedDate(format) {
    return formatDate(this.createdAt, format);
  }

  /**
   * Get formatted publication date
   * @param {string} format - Format to use (optional)
   * @returns {string} - Formatted date string or empty if not published
   */
  getFormattedPublishedDate(format) {
    return this.publishedAt ? formatDate(this.publishedAt, format) : '';
  }

  /**
   * Check if the article is published
   * @returns {boolean} - True if published
   */
  isPublished() {
    return this.publishedAt !== null;
  }

  /**
   * Get a summarized version of the article content
   * @param {number} maxLength - Maximum length of the summary
   * @returns {string} - Summarized content
   */
  getSummary(maxLength = 150) {
    // Strip HTML tags and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    if (plainText.length <= maxLength) {
      return plainText;
    }
    
    return plainText.substring(0, maxLength) + '...';
  }

  /**
   * Get the reading time estimate for the article
   * @param {number} wordsPerMinute - Reading speed in words per minute
   * @returns {number} - Estimated reading time in minutes
   */
  getReadingTime(wordsPerMinute = 200) {
    // Strip HTML tags and count words
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.content;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    const wordCount = plainText.split(/\s+/).length;
    
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

export default Article; 