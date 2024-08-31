import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClient;

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  onModuleDestroy() {
    this.client.quit();
  }

  getClient(): RedisClient {
    return this.client;
  }
}
