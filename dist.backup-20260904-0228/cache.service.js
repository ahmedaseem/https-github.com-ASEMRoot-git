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
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from './redis.module.js';
let CacheService = class CacheService {
    redis;
    constructor(redis) {
        this.redis = redis;
    }
    async set(key, value, ttl) {
        if (ttl) {
            return this.redis.set(key, value, 'EX', ttl);
        }
        return this.redis.set(key, value);
    }
    async get(key) {
        return this.redis.get(key);
    }
    async delete(key) {
        return this.redis.del(key);
    }
    async ping() {
        return this.redis.ping();
    }
};
CacheService = __decorate([
    Injectable(),
    __param(0, Inject(REDIS)),
    __metadata("design:paramtypes", [Redis])
], CacheService);
export { CacheService };
//# sourceMappingURL=cache.service.js.map