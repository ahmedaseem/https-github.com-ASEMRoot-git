var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Query, } from '@nestjs/common';
import sqlite3 from 'sqlite3';
let TestApiController = class TestApiController {
    db;
    constructor() {
        const databasePath = process.env.DATABASE_PATH ||
            '/root/my-site-app/instance/asem.db';
        this.db = new sqlite3.Database(databasePath);
    }
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (error, rows) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve((rows || []));
                }
            });
        });
    }
    pagination(query) {
        const page = Math.max(Number(query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
        const offset = (page - 1) * limit;
        return { page, limit, offset };
    }
    async countries() {
        const rows = await this.all(`SELECT *
       FROM countries
       WHERE is_active = 1
       ORDER BY name ASC`);
        return {
            status: 'ok',
            service: 'countries',
            mode: 'live',
            data: rows,
        };
    }
    async cities(query) {
        const { page, limit, offset } = this.pagination(query);
        const search = typeof query.search === 'string'
            ? query.search.trim()
            : '';
        const rows = await this.all(`SELECT *
       FROM cities
       WHERE is_active = 1
       AND name LIKE ?
       ORDER BY name ASC
       LIMIT ? OFFSET ?`, [`%${search}%`, limit, offset]);
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
    async businesses(query) {
        const { page, limit, offset } = this.pagination(query);
        const rows = await this.all(`SELECT *
       FROM businesses
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
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
    async products(query) {
        const { page, limit, offset } = this.pagination(query);
        const rows = await this.all(`SELECT *
       FROM products
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
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
    async tourism(query) {
        const { page, limit, offset } = this.pagination(query);
        const rows = await this.all(`SELECT *
       FROM tourism
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
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
    async projects(query) {
        const { page, limit, offset } = this.pagination(query);
        const rows = await this.all(`SELECT *
       FROM projects
       WHERE is_active = 1
       ORDER BY id DESC
       LIMIT ? OFFSET ?`, [limit, offset]);
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
};
__decorate([
    Get('countries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestApiController.prototype, "countries", null);
__decorate([
    Get('cities'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestApiController.prototype, "cities", null);
__decorate([
    Get('businesses'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestApiController.prototype, "businesses", null);
__decorate([
    Get('products'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestApiController.prototype, "products", null);
__decorate([
    Get('tourism'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestApiController.prototype, "tourism", null);
__decorate([
    Get('projects'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TestApiController.prototype, "projects", null);
TestApiController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [])
], TestApiController);
export { TestApiController };
//# sourceMappingURL=test-api.controller.js.map