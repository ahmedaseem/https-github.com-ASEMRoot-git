import {
  Controller,
  Get,
  OnModuleDestroy,
  Query,
} from '@nestjs/common';
import sqlite3 from 'sqlite3';

type QueryValue = string | number | boolean | null;
type ApiQuery = {
  page?: string;
  limit?: string;
  search?: string;
};

type NearbyQuery = {
  lat?: string;
  lon?: string;
  radiusKm?: string;
  type?: string;
};
@Controller()
export class TestApiController implements OnModuleDestroy {
  private readonly db: sqlite3.Database;

  constructor() {
    const databasePath =
      process.env.DATABASE_PATH ||
      '/root/my-site-app/instance/asem.db';

    this.db = new sqlite3.Database(databasePath);
  }

  private all<T>(
    sql: string,
    params: QueryValue[] = [],
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve((rows || []) as T[]);
        }
      });
    });
  }

  private pagination(query: ApiQuery) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  @Get('search')
  async search(@Query() query: ApiQuery & { type?: string }) {
    const q = typeof query.search === 'string'
      ? query.search.trim()
      : '';

    if (!q) {
      return {
        success: false,
        message: 'Search query (search) is required',
        data: [],
        count: 0,
      };
    }

    const type = String(query.type || 'all').trim().toLowerCase();
    const { page, limit, offset } = this.pagination(query);

    const like = `%${q}%`;
    const results: any[] = [];

    if (type === 'all' || type === 'business' || type === 'businesses') {
      const rows = await this.all<any>(
        `SELECT id, name, description, category, address, rating,
                'business' AS result_type
         FROM businesses
         WHERE is_active = 1
           AND (
             name LIKE ?
             OR description LIKE ?
             OR category LIKE ?
             OR address LIKE ?
           )
         ORDER BY id DESC`,
        [like, like, like, like],
      );
      results.push(...rows);
    }

    if (type === 'all' || type === 'product' || type === 'products') {
      const rows = await this.all<any>(
        `SELECT id, name, description, category, price, currency,
                'product' AS result_type
         FROM products
         WHERE is_active = 1
           AND is_available = 1
           AND (
             name LIKE ?
             OR description LIKE ?
             OR category LIKE ?
           )
         ORDER BY id DESC`,
        [like, like, like],
      );
      results.push(...rows);
    }

    if (type === 'all' || type === 'tourism') {
      const rows = await this.all<any>(
        `SELECT id, name, description, category, address, rating,
                'tourism' AS result_type
         FROM tourism
         WHERE is_active = 1
           AND (
             name LIKE ?
             OR description LIKE ?
             OR category LIKE ?
             OR address LIKE ?
           )
         ORDER BY id DESC`,
        [like, like, like, like],
      );
      results.push(...rows);
    }

    if (type === 'all' || type === 'project' || type === 'projects') {
      const rows = await this.all<any>(
        `SELECT id, name, description,
                'project' AS result_type
         FROM projects
         WHERE is_active = 1
           AND (
             name LIKE ?
             OR description LIKE ?
           )
         ORDER BY id DESC`,
        [like, like],
      );
      results.push(...rows);
    }

    const total = results.length;
    const data = results.slice(offset, offset + limit);

    return {
      success: true,
      data,
      count: data.length,
      total,
      pagination: {
        page,
        limit,
        offset,
      },
    };
  }

  @Get('countries')
  async countries() {
    const rows = await this.all(
      `SELECT *
       FROM countries
       WHERE is_active = 1
       ORDER BY name ASC`,
    );

    return {
      status: 'ok',
      service: 'countries',
      mode: 'live',
      data: rows,
    };
  }

  @Get('cities')
  async cities(@Query() query: ApiQuery) {
    const { page, limit, offset } = this.pagination(query);
    const search = typeof query.search === 'string'
      ? query.search.trim()
      : '';

    const rows = await this.all(
      `SELECT *
       FROM cities
       WHERE is_active = 1
       AND name LIKE ?
       ORDER BY name ASC
       LIMIT ? OFFSET ?`,
      [`%${search}%`, limit, offset],
    );

    return {
      status: 'ok',
      service: 'cities',
      mode: 'live',
      data: rows,
      pagination: {
        page,
        limit,
        returned: rows.length,
      },
    };
  }

  @Get('businesses')
  async businesses(@Query() query: ApiQuery) {
    const { page, limit, offset } = this.pagination(query);

    const rows = await this.all(
      `SELECT *
       FROM businesses
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return {
      status: 'ok',
      service: 'businesses',
      mode: 'live',
      data: rows,
      pagination: {
        page,
        limit,
        returned: rows.length,
      },
    };
  }

  @Get('products')
  async products(@Query() query: ApiQuery) {
    const { page, limit, offset } = this.pagination(query);

    const rows = await this.all(
      `SELECT *
       FROM products
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return {
      status: 'ok',
      service: 'products',
      mode: 'live',
      data: rows,
      pagination: {
        page,
        limit,
        returned: rows.length,
      },
    };
  }

  @Get('tourism')
  async tourism(@Query() query: ApiQuery) {
    const { page, limit, offset } = this.pagination(query);

    const rows = await this.all(
      `SELECT *
       FROM tourism
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return {
      status: 'ok',
      service: 'tourism',
      mode: 'live',
      data: rows,
      pagination: {
        page,
        limit,
        returned: rows.length,
      },
    };
  }

  @Get('nearby')
  async nearby(@Query() query: NearbyQuery) {
    const latitude = Number(query.lat);
    const longitude = Number(query.lon);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return {
        status: 'error',
        service: 'nearby',
        error: 'Valid lat and lon are required.',
        data: [],
      };
    }

    const radiusValue = Number(query.radiusKm);
    const radiusKm = Number.isFinite(radiusValue)
      ? Math.min(Math.max(radiusValue, 0.1), 200)
      : 25;

    const type = String(query.type || 'all').trim().toLowerCase();

    const globalDbPath = '/root/my-site-app/asem.db';

    const globalCities = await new Promise<any[]>((resolve, reject) => {
      const globalDb = new sqlite3.Database(globalDbPath);

      globalDb.all(
        `SELECT
           id,
           country_id,
           name,
           latitude,
           longitude
         FROM cities
         WHERE is_active = 1
           AND latitude IS NOT NULL
           AND longitude IS NOT NULL`,
        [],
        (error, rows) => {
          globalDb.close();

          if (error) {
            reject(error);
          } else {
            resolve((rows || []) as any[]);
          }
        },
      );
    });

    const toRadians = (value: number) => (value * Math.PI) / 180;

    const distanceKm = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const earthRadiusKm = 6371;
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) ** 2;

      return (
        earthRadiusKm *
        2 *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      );
    };

    const nearestCities = globalCities
      .map((city) => ({
        ...city,
        distance_km: distanceKm(
          latitude,
          longitude,
          Number(city.latitude),
          Number(city.longitude),
        ),
      }))
      .filter((city) => city.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km)
      .slice(0, 50);

    if (!nearestCities.length) {
      return [];
    }

    const results: any[] = [];

    for (const city of nearestCities) {
      const cityName = String(city.name || '').trim();
      const countryId = Number(city.country_id);

      if (
        !cityName ||
        !Number.isFinite(countryId)
      ) {
        continue;
      }

      if (type === 'all' || type === 'tourism') {
        const tourismRows = await this.all<any>(
          `SELECT
             id,
             name,
             description,
             category,
             address,
             image,
             rating,
             latitude,
             longitude,
             'tourism' AS type
           FROM tourism
           WHERE is_active = 1
             AND city_id IN (
               SELECT id
               FROM cities
               WHERE country_id = ?
                 AND name = ?
             )`,
          [countryId, cityName],
        );

        results.push(
          ...tourismRows.map((row) => ({
            ...row,
            distance_km: city.distance_km,
            city: cityName,
            country_id: countryId,
          })),
        );
      }

      if (
        type === 'all' ||
        type === 'business' ||
        type === 'businesses'
      ) {
        const businessRows = await this.all<any>(
          `SELECT
             b.id,
             b.name,
             b.description,
             b.category,
             b.address,
             b.logo,
             b.cover_image,
             b.rating,
             'business' AS type
           FROM businesses b
           JOIN cities c ON c.id = b.city_id
           WHERE b.is_active = 1
             AND c.country_id = ?
             AND c.name = ?`,
          [countryId, cityName],
        );

        results.push(
          ...businessRows.map((row) => ({
            ...row,
            distance_km: city.distance_km,
            city: cityName,
            country_id: countryId,
          })),
        );
      }

      if (
        type === 'all' ||
        type === 'product' ||
        type === 'products'
      ) {
        const productRows = await this.all<any>(
          `SELECT
             p.id,
             p.name,
             p.description,
             p.category,
             p.price,
             p.currency,
             p.image,
             'product' AS type
           FROM products p
           JOIN businesses b ON b.id = p.business_id
           JOIN cities c ON c.id = b.city_id
           WHERE p.is_active = 1
             AND p.is_available = 1
             AND b.is_active = 1
             AND c.country_id = ?
             AND c.name = ?`,
          [countryId, cityName],
        );

        results.push(
          ...productRows.map((row) => ({
            ...row,
            distance_km: city.distance_km,
            city: cityName,
            country_id: countryId,
          })),
        );
      }
    }

    results.sort(
      (a, b) => Number(a.distance_km) - Number(b.distance_km),
    );

    return results.slice(0, 200);
  }

  onModuleDestroy() {
    this.db.close();
  }
}
