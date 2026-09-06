import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Injectable,
  OnModuleDestroy,
  Post,
} from '@nestjs/common';
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

interface LocationInput {
  latitude?: number | string;
  longitude?: number | string;
  accuracy?: number | string;
  altitude?: number | string;
  speed?: number | string;
  heading?: number | string;
  name?: string;
  label?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
@Controller('location')
export class LocationController implements OnModuleDestroy {
  private readonly databasePath =
    process.env.ASEM_DB_PATH || '/root/my-site-app/asem.db';
  private readonly db: Database.Database;

  constructor() {
    mkdirSync(dirname(this.databasePath), { recursive: true });
    this.db = new Database(this.databasePath, {
      fileMustExist: false,
      timeout: 5000,
    });

    this.db.pragma('journal_mode = WAL');
    this.db.pragma('busy_timeout = 5000');

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS platform_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        accuracy REAL,
        altitude REAL,
        speed REAL,
        heading REAL,
        name TEXT,
        label TEXT,
        source TEXT NOT NULL DEFAULT 'platform',
        metadata TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE INDEX IF NOT EXISTS idx_platform_locations_created_at
      ON platform_locations(created_at DESC);
    `);
  }

  @Get()
  getLocation() {
    const latest = this.db
      .prepare(
        `SELECT id, latitude, longitude, accuracy, altitude, speed,
                heading, name, label, source, metadata, created_at AS createdAt
         FROM platform_locations
         ORDER BY datetime(created_at) DESC, id DESC
         LIMIT 1`,
      )
      .get() as Record<string, unknown> | undefined;

    return {
      status: 'ok',
      service: 'location',
      source: 'database',
      location: latest ? this.deserialize(latest) : null,
    };
  }

  @Post()
  @HttpCode(201)
  saveLocation(@Body() body: LocationInput) {
    const latitude = this.toNumber(body.latitude);
    const longitude = this.toNumber(body.longitude);

    if (
      latitude === null ||
      longitude === null ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new BadRequestException(
        'latitude and longitude must be valid geographic coordinates',
      );
    }

    const result = this.db
      .prepare(
        `INSERT INTO platform_locations
          (latitude, longitude, accuracy, altitude, speed, heading,
           name, label, source, metadata)
         VALUES
          (@latitude, @longitude, @accuracy, @altitude, @speed, @heading,
           @name, @label, @source, @metadata)`,
      )
      .run({
        latitude,
        longitude,
        accuracy: this.toNumber(body.accuracy),
        altitude: this.toNumber(body.altitude),
        speed: this.toNumber(body.speed),
        heading: this.toNumber(body.heading),
        name: this.toText(body.name),
        label: this.toText(body.label),
        source: this.toText(body.source) || 'platform',
        metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      });

    const saved = this.db
      .prepare(
        `SELECT id, latitude, longitude, accuracy, altitude, speed,
                heading, name, label, source, metadata, created_at AS createdAt
         FROM platform_locations WHERE id = ?`,
      )
      .get(result.lastInsertRowid) as Record<string, unknown>;

    return {
      status: 'ok',
      service: 'location',
      source: 'database',
      saved: this.deserialize(saved),
    };
  }

  onModuleDestroy() {
    this.db.close();
  }

  private deserialize(row: Record<string, unknown>) {
    let metadata: Record<string, unknown> | null = null;

    if (typeof row.metadata === 'string' && row.metadata.length > 0) {
      try {
        metadata = JSON.parse(row.metadata) as Record<string, unknown>;
      } catch {
        metadata = null;
      }
    }

    return { ...row, metadata };
  }

  private toNumber(value: unknown): number | null {
    if (value === undefined || value === null || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  private toText(value: unknown): string | null {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text.length > 0 ? text : null;
  }
}
