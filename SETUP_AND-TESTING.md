# K-GPS Search & Map Features - Setup and Testing Guide

## Overview
This document provides setup instructions and testing procedures for the Global Search and Nearby/Map features.

## Files Modified/Created

### Fixed Files:
1. **app.js** - Fixed GPS parameter bug (`lat` → `latitude`)
2. **search.service.js** - Updated to query database instead of in-memory adapter

### New Files:
1. **nearby.service.js** - Nearby location search with distance calculation
2. **nearby.controller.js** - API endpoints for nearby searches
3. **search.controller.js** - Updated search API controller
4. **DATABASE_SCHEMA.sql** - Complete database schema with sample data

---

## Setup Instructions

### 1. Database Setup

#### Option A: PostgreSQL (Recommended)
```bash
# Connect to your PostgreSQL database
psql -U postgres -d k_gps_db

# Run the schema file
\i DATABASE_SCHEMA.sql

# Verify tables were created
\dt
