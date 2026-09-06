// search.controller.js - Search API controller

const searchService = require("./search.service");

/**
 * Global search endpoint
 * GET /api/search?q=<query>&type=<type>&limit=<limit>&offset=<offset>
 */
exports.globalSearch = async (req, res, next) => {
  try {
    const { q, type, limit, offset } = req.query;

    // Validate required parameters
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query (q) is required"
      });
    }

    const results = await searchService.globalSearch({
      q,
      type: type || "all",
      limit: Math.min(parseInt(limit) || 20, 100),
      offset: Math.max(parseInt(offset) || 0, 0)
    });

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error("Search controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Search failed"
    });
  }
};

/**
 * Search suggestions (autocomplete) endpoint
 * GET /api/search/suggestions?prefix=<prefix>
 */
exports.getSearchSuggestions = async (req, res, next) => {
  try {
    const { prefix } = req.query;

    if (!prefix || prefix.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Prefix must be at least 2 characters"
      });
    }

    const suggestions = await searchService.getSearchSuggestions(prefix);

    res.json({
      success: true,
      data: suggestions,
      count: suggestions.length
    });

  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get suggestions"
    });
  }
};
