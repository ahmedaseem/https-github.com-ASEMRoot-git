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

  @Get('projects')
  async projects(@Query() query: ApiQuery) {
    const { page, limit, offset } = this.pagination(query);

    const rows = await this.all(
      `SELECT *
       FROM projects
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    return {
      status: 'ok',
      service: 'projects',
      mode: 'live',
      data: rows,
      pagination: {
        page,
        limit,
        returned: rows.length,
      },
    };
  }

  onModuleDestroy() {
    this.db.close();
  }
}
