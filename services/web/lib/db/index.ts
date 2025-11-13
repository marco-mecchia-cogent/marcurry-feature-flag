import { config } from '@/lib/config';
import { StorageAdapter } from '../adapters/StorageAdapter';
import InMemoryAdapter from '../adapters/InMemoryAdapter';

export function initializeAdapter(): StorageAdapter {
  const adapterType = config.DATABASE_ADAPTER;
  console.log(`Initializing database adapter: ${adapterType}`);

  switch (adapterType) {
    case 'in-memory':
      return new InMemoryAdapter();

    default:
      console.warn(`Unknown DATABASE_ADAPTER: "${adapterType}". Defaulting to in-memory.`);
      return new InMemoryAdapter();
  }
}
