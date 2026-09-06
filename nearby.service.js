// nearby.service.js - Nearby location search service

const db = require("./database");

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - User latitude
 * @param {number} lon1 - User longitude
 * @param {number} lat2 - Location latitude
 * @param {number} lon2 - Location longitude
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find nearby businesses, products, and tourism locations
 * @param {Object} options - Search options
 * @param {number} options.latitude - User latitude
 * @param {number} options.longitude - User longitude
 * @param {number} [options.radiusKm] - Search radius in kilometers (default: 25)
 * @param {string} [options.type] - Filter by type (business, product, tourism, all)
 * @param {number} [options.limit] - Result limit (default: 50)
 * @returns {Promise<Array>} Array of nearby locations with distances
 */
exports.findNearby = async (options) => {
  const {
    latitude,
    longitude,
    radiusKm = 25,
    type = "all",
    limit = 50
  } = options;

  // Validate coordinates
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    throw new Error("Valid latitude and longitude are required");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Latitude must be between -90 and 90");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Longitude must be between -180 and 180");
  }

  try {
    const results = [];

    // Search radius in degrees (approximate)
    const latDelta = radiusKm / 111.0;
    const lonDelta = radiusKm / (111.0 * Math.cos(latitude * Math.PI / 180));

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
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND latitude BETWEEN $1 AND $2
          AND longitude BETWEEN $3 AND $4
        ORDER BY created_at DESC
        LIMIT $5
      `;

      const businessParams = [
        latitude - latDelta,
        latitude + latDelta,
        longitude - lonDelta,
        longitude + lonDelta,
        limit * 2 // Get extra results for filtering
      ];

      const businessResults = await db.query(businessQuery, businessParams);
      
      if (businessResults.rows) {
        businessResults.rows.forEach(row => {
          const distance = calculateDistance(latitude, longitude, row.latitude, row.longitude);
          
          // Only include if within radius
          if (distance <= radiusKm) {
            results.push({
              ...row,
              distance: parseFloat(distance.toFixed(2)),
              distance_km: `${distance.toFixed(2)} km`
            });
          }
        });
      }
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
        WHERE created_at IS NOT NULL
        ORDER BY created_at DESC
        LIMIT $1
      `;

      const productResults = await db.query(productQuery, [limit]);
      
      if (productResults.rows) {
        productResults.rows.forEach(row => {
          results.push({
            ...row,
            distance: null,
            distance_km: "On Platform"
          });
        });
      }
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
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
          AND latitude BETWEEN $1 AND $2
          AND longitude BETWEEN $3 AND $4
        ORDER BY created_at DESC
        LIMIT $5
      `;

      const tourismParams = [
        latitude - latDelta,
        latitude + latDelta,
        longitude - lonDelta,
        longitude + lonDelta,
        limit * 2
      ];

      const tourismResults = await db.query(tourismQuery, tourismParams);
      
      if (tourismResults.rows) {
        tourismResults.rows.forEach(row => {
          const distance = calculateDistance(latitude, longitude, row.latitude, row.longitude);
          
          // Only include if within radius
          if (distance <= radiusKm) {
            results.push({
              ...row,
              distance: parseFloat(distance.toFixed(2)),
              distance_km: `${distance.toFixed(2)} km`
            });
          }
        });
      }
    }

    // Sort by distance (closest first), then by rating
    results.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      if (a.distance !== null) return -1;
      if (b.distance !== null) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return results.slice(0, limit);

  } catch (error) {
    console.error("Nearby search error:", error);
    throw new Error(`Nearby search failed: ${error.message}`);
  }
};

/**
 * Get nearby businesses only
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of nearby businesses
 */
exports.findNearbyBusinesses = async (options) => {
  return exports.findNearby({ ...options, type: "business" });
};

/**
 * Get nearby tourism locations only
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Array of nearby tourism locations
 */
exports.findNearbyTourism = async (options) => {
  return exports.findNearby({ ...options, type: "tourism" });
};
