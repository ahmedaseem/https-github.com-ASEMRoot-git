// nearby.controller.js - Nearby location search API controller

const nearbyService = require("./nearby.service");

/**
 * Find nearby locations endpoint
 * GET /api/nearby?latitude=<lat>&longitude=<lon>&radiusKm=<radius>&type=<type>&limit=<limit>
 */
exports.findNearby = async (req, res, next) => {
  try {
    const { latitude, longitude, radiusKm, type, limit } = req.query;

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required"
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Validate coordinate format
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude must be valid numbers"
      });
    }

    // Validate coordinate ranges
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: "latitude must be between -90 and 90"
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        message: "longitude must be between -180 and 180"
      });
    }

    // Get nearby locations
    const results = await nearbyService.findNearby({
      latitude: lat,
      longitude: lon,
      radiusKm: Math.min(parseFloat(radiusKm) || 25, 100),
      type: type || "all",
      limit: Math.min(parseInt(limit) || 50, 200)
    });

    res.json({
      success: true,
      data: results,
      count: results.length,
      userLocation: {
        latitude: lat,
        longitude: lon
      }
    });

  } catch (error) {
    console.error("Nearby search controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Nearby search failed"
    });
  }
};

/**
 * Find nearby businesses only endpoint
 * GET /api/nearby/businesses?latitude=<lat>&longitude=<lon>&radiusKm=<radius>&limit=<limit>
 */
exports.findNearbyBusinesses = async (req, res, next) => {
  try {
    const { latitude, longitude, radiusKm, limit } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required"
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude must be valid numbers"
      });
    }

    const results = await nearbyService.findNearbyBusinesses({
      latitude: lat,
      longitude: lon,
      radiusKm: Math.min(parseFloat(radiusKm) || 25, 100),
      limit: Math.min(parseInt(limit) || 50, 200)
    });

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error("Nearby businesses search error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Nearby businesses search failed"
    });
  }
};

/**
 * Find nearby tourism locations only endpoint
 * GET /api/nearby/tourism?latitude=<lat>&longitude=<lon>&radiusKm=<radius>&limit=<limit>
 */
exports.findNearbyTourism = async (req, res, next) => {
  try {
    const { latitude, longitude, radiusKm, limit } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude are required"
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "latitude and longitude must be valid numbers"
      });
    }

    const results = await nearbyService.findNearbyTourism({
      latitude: lat,
      longitude: lon,
      radiusKm: Math.min(parseFloat(radiusKm) || 25, 100),
      limit: Math.min(parseInt(limit) || 50, 200)
    });

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error("Nearby tourism search error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Nearby tourism search failed"
    });
  }
};
