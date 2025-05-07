/**
 * Generic model for paginated responses from the API
 */
class PaginatedResponse {
  constructor(data = {}) {
    this.items = data.items || [];
    this.pageNumber = data.pageNumber || 1;
    this.pageSize = data.pageSize || 10;
    this.totalCount = data.totalCount || 0;
    this.totalPages = data.totalPages || 0;
  }

  /**
   * Creates a PaginatedResponse instance from API response
   * @param {Object} data - The API response data
   * @param {Function} itemTransformer - Function to transform each item
   * @returns {PaginatedResponse} - A PaginatedResponse instance
   */
  static fromApiResponse(data, itemTransformer = null) {
    const response = new PaginatedResponse({
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalCount: data.totalCount,
      totalPages: data.totalPages
    });
    
    if (Array.isArray(data.items)) {
      response.items = itemTransformer ? 
        data.items.map(item => itemTransformer(item)) : 
        [...data.items];
    }
    
    return response;
  }

  /**
   * Checks if there is a next page
   * @returns {boolean}
   */
  hasNextPage() {
    return this.pageNumber < this.totalPages;
  }

  /**
   * Checks if there is a previous page
   * @returns {boolean}
   */
  hasPreviousPage() {
    return this.pageNumber > 1;
  }

  /**
   * Gets the next page number
   * @returns {number|null} - Returns null if there is no next page
   */
  getNextPageNumber() {
    return this.hasNextPage() ? this.pageNumber + 1 : null;
  }

  /**
   * Gets the previous page number
   * @returns {number|null} - Returns null if there is no previous page
   */
  getPreviousPageNumber() {
    return this.hasPreviousPage() ? this.pageNumber - 1 : null;
  }
}

export default PaginatedResponse; 