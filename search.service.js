// search.service.js - Database-backed search service

const db = require("./database");

/**
 * Global search across all business, product, and tourism entities
 * @param {Object} query - Search query object
 * @param {string} query.q - Search term
 * @param {string} [query.type] - Filter by type (business, product, tourism, all)
 * @param {number} [query.limit] - Result limit (default: 20)
 * @returns {Promise<Array>} Array of search results
 */
exports.globalSearch = async (query) => {
  const { q, type = "all", limit = 20 } = query;

  if (!q || q.trim().length === 0) {
    throw new Error("Search query cannot be empty");
  }

  const searchTerm = q.trim();
  const offset = query.offset || 0;

  try {
    const results = [];

    // Build search conditions
    const conditions = [];
    const params = [];

    // Search term matching
    const searchCondition = `
      (name ILIKE $${params.length + 1} 
       OR description ILIKE $${params.length + 1}
       OR address ILIKE $${params.length + 1}
       OR tags ILIKE $${params.length + 1})
    `;
    params.push(`%${searchTerm}%`);

    // Type filtering
    if (type !== "all") {
      conditions.push(`type = $${params.length + 1}`);
      params.push(type);
    }

    const whereClause = [searchCondition, ...conditions].join(" AND ");

    // Search in businesses
    if (type === "all" || type === "business") {
      const businessQuery = `
        SELECT 
          id,
          name,
          description,
          address,
          phone,
          latitude,
          longitude,
          'business' as result_type,
          '🏢' as icon,
          rating,
          created_at
        FROM businesses
        WHERE ${whereClause}
        ORDER BY rating DESC, created_at DESC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
      `;
      const businessParams = [...params, limit, offset];
      
      const businessResults = await db.query(businessQuery, businessParams);
      results.push(...(businessResults.rows || []));
    }

    // Search in products
    if (type === "all" || type === "product") {
      const productQuery = `
        SELECT 
          id,
          name,
          description,
          'product' as result_type,
          '📦' as icon,
          price,
          created_at
        FROM products
        WHERE ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
      `;
      const productParams = [...params, limit, offset];
      
      const productResults = await db.query(productQuery, productParams);
      results.push(...(productResults.rows || []));
    }

    // Search in tourism locations
    if (type === "all" || type === "tourism") {
      const tourismQuery = `
        SELECT 
          id,
          name,
          description,
          address,
          latitude,
          longitude,
          'tourism' as result_type,
          '🏖️' as icon,
          rating,
          created_at
        FROM tourism_locations
        WHERE ${whereClause}
        ORDER BY rating DESC, created_at DESC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
      `;
      const tourismParams = [...params, limit, offset];
      
      const tourismResults = await db.query(tourismQuery, tourismParams);
      results.push(...(tourismResults.rows || []));
    }

    // Sort combined results by relevance and recency
    results.sort((a, b) => {
      const aScore = (a.rating || 0) * 10 + (new Date(b.created_at) - new Date(a.created_at)) / 1000;
      const bScore = (b.rating || 0) * 10 + (new Date(b.created_at) - new Date(a.created_at)) / 1000;
      return bScore - aScore;
    });

    return results.slice(0, limit);

  } catch (error) {
    console.error("Global search error:", error);
    throw new Error(`Search failed: ${error.message}`);
  }
};

/**
 * Search suggestions (autocomplete)
 * @param {string} prefix - Search prefix
 * @returns {Promise<Array>} Array of suggestions
 */
exports.getSearchSuggestions = async (prefix) => {
  try {
    const suggestions = new Set();

    // Get business name suggestions
    const businessQuery = `
      SELECT DISTINCT name
      FROM businesses
      WHERE name ILIKE $1
      LIMIT 10
    `;
    const businessResults = await db.query(businessQuery, [`${prefix}%`]);
    businessResults.rows?.forEach(r => suggestions.add(r.name));

    // Get product name suggestions
    const productQuery = `
      SELECT DISTINCT name
      FROM products
      WHERE name ILIKE $1
      LIMIT 10
    `;
    const productResults = await db.query(productQuery, [`${prefix}%`]);
    productResults.rows?.forEach(r => suggestions.add(r.name));

    // Get tourism location suggestions
    const tourismQuery = `
      SELECT DISTINCT name
      FROM tourism_locations
      WHERE name ILIKE $1
      LIMIT 10
    `;
    const tourismResults = await db.query(tourismQuery, [`${prefix}%`]);
    tourismResults.rows?.forEach(r => suggestions.add(r.name));

    return Array.from(suggestions).sort();

  } catch (error) {
    console.error("Search suggestions error:", error);
    return [];
  }
};
