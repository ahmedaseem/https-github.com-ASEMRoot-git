-- DATABASE SCHEMA for k-gps Application
-- Supports Global Search and Nearby/Map features

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(500),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(500),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  rating DECIMAL(3, 2) DEFAULT 0,
  category VARCHAR(100),
  tags VARCHAR(500), -- comma-separated tags for search
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  
  CONSTRAINT businesses_valid_coords CHECK (
    (latitude IS NULL AND longitude IS NULL) OR
    (latitude IS NOT NULL AND longitude IS NOT NULL)
  ),
  CONSTRAINT businesses_valid_latitude CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  CONSTRAINT businesses_valid_longitude CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180)),
  CONSTRAINT businesses_valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Create indexes for search performance
CREATE INDEX IF NOT EXISTS idx_businesses_name ON businesses (name);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses (category);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses (status);
CREATE INDEX IF NOT EXISTS idx_businesses_coords ON businesses (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses (rating DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_created ON businesses (created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_businesses_search ON businesses 
  USING GIN(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')));

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(12, 2),
  category VARCHAR(100),
  tags VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  business_id INTEGER REFERENCES businesses(id) ON DELETE SET NULL,
  
  CONSTRAINT products_valid_price CHECK (price IS NULL OR price >= 0)
);

-- Create indexes for product search
CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_business ON products (business_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products (status);
CREATE INDEX IF NOT EXISTS idx_products_created ON products (created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_search ON products 
  USING GIN(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')));

-- ============================================
-- TOURISM LOCATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tourism_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(500),
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(500),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  category VARCHAR(100),
  tags VARCHAR(500),
  opening_hours VARCHAR(500),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER,
  
  CONSTRAINT tourism_valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT tourism_valid_longitude CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT tourism_valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Create indexes for tourism search and geospatial queries
CREATE INDEX IF NOT EXISTS idx_tourism_name ON tourism_locations (name);
CREATE INDEX IF NOT EXISTS idx_tourism_category ON tourism_locations (category);
CREATE INDEX IF NOT EXISTS idx_tourism_status ON tourism_locations (status);
CREATE INDEX IF NOT EXISTS idx_tourism_coords ON tourism_locations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_tourism_rating ON tourism_locations (rating DESC);
CREATE INDEX IF NOT EXISTS idx_tourism_created ON tourism_locations (created_at DESC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_tourism_search ON tourism_locations 
  USING GIN(to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(description, '')));

-- ============================================
-- SEARCH HISTORY TABLE (Optional - for analytics)
-- ============================================
CREATE TABLE IF NOT EXISTS search_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  search_query VARCHAR(255) NOT NULL,
  search_type VARCHAR(50), -- 'global', 'nearby'
  filters JSONB,
  result_count INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history (user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history (search_query);
CREATE INDEX IF NOT EXISTS idx_search_history_created ON search_history (created_at DESC);

-- ============================================
-- BUSINESS REVIEWS TABLE (Optional)
-- ============================================
CREATE TABLE IF NOT EXISTS business_reviews (
  id SERIAL PRIMARY KEY,
  business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id INTEGER,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON business_reviews (business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON business_reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON business_reviews (created_at DESC);

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Insert sample businesses
INSERT INTO businesses (name, description, address, phone, latitude, longitude, rating, category, tags, status) 
VALUES 
  ('Cafe Central', 'Popular coffee shop in downtown', '123 Main St', '+1-555-0100', 40.7580, -73.9855, 4.5, 'cafe', 'coffee,food,casual', 'active'),
  ('Tech Store Pro', 'Electronics and gadgets', '456 Park Ave', '+1-555-0101', 40.7489, -73.9680, 4.2, 'retail', 'electronics,gadgets', 'active'),
  ('Green Pharmacy', 'Local pharmacy with health products', '789 5th Ave', '+1-555-0102', 40.7549, -73.9840, 4.8, 'pharmacy', 'health,pharmacy,medicine', 'active')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category, tags, status, business_id)
VALUES
  ('Premium Coffee Beans', 'Freshly roasted arabica beans', 15.99, 'coffee', 'coffee,organic', 'active', 1),
  ('USB-C Cable', 'High-quality USB-C charging cable', 12.99, 'electronics', 'cable,charger', 'active', 2),
  ('Vitamin C Tablets', 'Daily vitamin C supplement', 8.99, 'vitamins', 'supplements,health', 'active', 3)
ON CONFLICT DO NOTHING;

-- Insert sample tourism locations
INSERT INTO tourism_locations (name, description, address, latitude, longitude, rating, category, tags, status)
VALUES
  ('Central Park', 'Large urban park with trails and attractions', 'New York, NY', 40.7829, -73.9654, 4.7, 'park', 'park,nature,recreation', 'active'),
  ('Statue of Liberty', 'Iconic monument and museum', 'Liberty Island', 40.6892, -74.0445, 4.8, 'monument', 'historical,iconic', 'active'),
  ('Times Square', 'Famous intersection and entertainment area', 'New York, NY', 40.7580, -73.9855, 4.5, 'plaza', 'shopping,entertainment', 'active')
ON CONFLICT DO NOTHING;

-- ============================================
-- DATABASE FUNCTIONS FOR SEARCH
-- ============================================

-- Function to search businesses
CREATE OR REPLACE FUNCTION search_businesses(search_term TEXT, limit_count INT DEFAULT 20)
RETURNS TABLE(id INT, name VARCHAR, description TEXT, address VARCHAR, rating DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT b.id, b.name, b.description, b.address, b.rating
  FROM businesses b
  WHERE b.status = 'active' AND (
    b.name ILIKE '%' || search_term || '%' OR
    b.description ILIKE '%' || search_term || '%' OR
    b.tags ILIKE '%' || search_term || '%'
  )
  ORDER BY b.rating DESC, b.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby businesses
CREATE OR REPLACE FUNCTION find_nearby_businesses(
  user_lat DECIMAL,
  user_lon DECIMAL,
  radius_km DECIMAL DEFAULT 25
)
RETURNS TABLE(
  id INT,
  name VARCHAR,
  address VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  rating DECIMAL,
  distance_km DECIMAL
) AS $$
DECLARE
  lat_delta DECIMAL;
  lon_delta DECIMAL;
BEGIN
  lat_delta := radius_km / 111.0;
  lon_delta := radius_km / (111.0 * COS(user_lat * PI() / 180.0));
  
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    b.address,
    b.latitude,
    b.longitude,
    b.rating,
    ROUND(
      CAST(
        6371.0 * 
        ACOS(
          COS(PI()/2.0 - RADIANS(b.latitude)) * 
          COS(PI()/2.0 - RADIANS(user_lat)) +
          SIN(PI()/2.0 - RADIANS(b.latitude)) * 
          SIN(PI()/2.0 - RADIANS(user_lat)) * 
          COS(RADIANS(b.longitude) - RADIANS(user_lon))
        ) 
      AS DECIMAL),
      2
    ) as distance_km
  FROM businesses b
  WHERE b.status = 'active'
    AND b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    AND b.latitude BETWEEN user_lat - lat_delta AND user_lat + lat_delta
    AND b.longitude BETWEEN user_lon - lon_delta AND user_lon + lon_delta
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;
