import type { HandleCache, ResolvedHandle } from "#handle-resolver";

import { KVNamespace } from "@cloudflare/workers-types";

const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour
const DEFAULT_MAX_SIZE = 1024;

export interface HandleCacheKVOptions {
  /** in milliseconds */
  ttl?: number;
  /** in bytes */
  maxSize?: number;
}

export class HandleCacheKV implements HandleCache {
  namespace: KVNamespace;
  ttl: number;
  maxSize: number;

  constructor(namespace: KVNamespace, options: HandleCacheKVOptions) {
    this.namespace = namespace;
    this.ttl = options.ttl ?? DEFAULT_TTL;
    this.maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
  }

  async get(key: string): Promise<ResolvedHandle | undefined> {
    const value = await this.namespace.get(key);
    if (value === null) {
      return undefined;
    } else {
      return value as ResolvedHandle;
    }
  }

  async set(key: string, value: ResolvedHandle): Promise<void> {
    if (value === null) {
      await this.namespace.delete(key);
    } else {
      await this.namespace.put(key, value, {
        expirationTtl: Math.round(this.ttl / 1000),
      });
    }
  }

  async del(key: string): Promise<void> {
    await this.namespace.delete(key);
  }
}
