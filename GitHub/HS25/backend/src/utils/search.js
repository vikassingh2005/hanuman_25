/**
 * Search utility for MongoDB
 * Provides text search functionality with advanced options
 */

/**
 * Build MongoDB search query based on search parameters
 * @param {Object} reqQuery - Request query object
 * @param {Array} searchableFields - Fields that can be searched
 * @returns {Object} MongoDB query object
 */
exports.buildSearchQuery = (reqQuery, searchableFields = []) => {
  const { search, ...otherParams } = reqQuery;
  let query = { ...otherParams };

  // If search term is provided, create text search query
  if (search) {
    // If specific searchable fields are provided, create OR conditions
    if (searchableFields && searchableFields.length > 0) {
      query.$or = searchableFields.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    } else {
      // Use MongoDB text search if no specific fields are provided
      // Note: This requires text index on the collection
      query.$text = { $search: search };
    }
  }

  return query;
};

/**
 * Apply search to a Mongoose query
 * @param {Object} model - Mongoose model
 * @param {Object} reqQuery - Request query object
 * @param {Array} searchableFields - Fields that can be searched
 * @returns {Object} Mongoose query with search applied
 */
exports.applySearch = (model, reqQuery, searchableFields = []) => {
  const searchQuery = this.buildSearchQuery(reqQuery, searchableFields);
  return model.find(searchQuery);
};

/**
 * Create text index on specified fields in a model
 * @param {Object} model - Mongoose model
 * @param {Array} fields - Fields to create text index on
 * @returns {Promise} Promise resolving to index creation result
 */
exports.createTextIndex = async (model, fields = []) => {
  const indexFields = {};
  
  fields.forEach(field => {
    indexFields[field] = 'text';
  });
  
  return model.collection.createIndex(indexFields);
};