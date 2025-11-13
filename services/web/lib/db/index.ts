import { config } from '@/lib/config';
import { StorageAdapter } from './StorageAdapter';

import Redis from 'ioredis';
import InMemoryAdapter from '../adapters/InMemoryAdapter';
import RedisAdapter from '../adapters/RedisAdapter';

declare global {
  var dbAdapter: StorageAdapter | undefined;
  var redisClient: Redis | undefined;
}

function initializeAdapter(): StorageAdapter {
  const adapterType = config.DATABASE_ADAPTER;
  console.log(`Initializing database adapter: ${adapterType}`);

  switch (adapterType) {
    case 'redis':
      if (!config.REDIS_URL) {
        throw new Error('REDIS_URL is required for Redis adapter');
      }

      if (!global.redisClient) {
        global.redisClient = new Redis(config.REDIS_URL);
      }
      return new RedisAdapter(global.redisClient);

    case 'in-memory':
      return new InMemoryAdapter();

    default:
      console.warn(`Unknown DATABASE_ADAPTER: "${adapterType}". Defaulting to in-memory.`);
      return new InMemoryAdapter();
  }
}

export function getDb(): StorageAdapter {
  if (!global.dbAdapter) {
    global.dbAdapter = initializeAdapter();
  }
  return global.dbAdapter;
}
