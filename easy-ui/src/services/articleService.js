import apiClient from '../config/axios';
import Article from '../models/Article';
import PaginatedResponse from '../models/PaginatedResponse';

/**
 * Service for interacting with the Article API
 */
const articleService = {
  /**
   * Get all articles with pagination
   * @param {number} pageNumber - Page number, defaults to 1
   * @param {number} pageSize - Page size, defaults to 10
   * @returns {Promise<PaginatedResponse>} - Paginated response containing articles
   */
  async getAll(pageNumber = 1, pageSize = 10) {
    try {
      const response = await apiClient.get('/Article', {
        params: {
          pageNumber,
          pageSize
        }
      });

      return PaginatedResponse.fromApiResponse(response.data, data => Article.fromApiResponse(data));
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  /**
   * Get an article by ID
   * @param {string} id - Article ID
   * @returns {Promise<Article>} - Article instance
   */
  async getById(id) {
    try {
      const response = await apiClient.get(`/Article/${id}`);
      return Article.fromApiResponse(response.data);
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get latest articles
   * @param {number} count - Number of latest articles to retrieve
   * @returns {Promise<Array<Article>>} - Array of Article instances
   */
  async getLatest(count = 5) {
    try {
      const response = await apiClient.get('/Article/latest', {
        params: { count }
      });
      
      return response.data.map(item => Article.fromApiResponse(item));
    } catch (error) {
      console.error('Error fetching latest articles:', error);
      throw error;
    }
  },

  /**
   * Get articles by author ID with pagination
   * @param {string} authorId - Author ID
   * @param {number} pageNumber - Page number, defaults to 1
   * @param {number} pageSize - Page size, defaults to 10
   * @returns {Promise<PaginatedResponse>} - Paginated response containing articles
   */
  async getByAuthor(authorId, pageNumber = 1, pageSize = 10) {
    try {
      const response = await apiClient.get(`/Article/author/${authorId}`, {
        params: {
          pageNumber,
          pageSize
        }
      });

      return PaginatedResponse.fromApiResponse(response.data, data => Article.fromApiResponse(data));
    } catch (error) {
      console.error(`Error fetching articles for author ${authorId}:`, error);
      throw error;
    }
  }
};

export default articleService; 