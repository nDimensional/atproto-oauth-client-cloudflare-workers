import type { Did, DidDocument } from "@atproto/did";

import { KVNamespace } from "@cloudflare/workers-types";

import { DidCache } from "#did-resolver";

const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour
const DEFAULT_MAX_SIZE = 50 * 1024 * 1024; // ~50MB

export interface DidCacheKVOptions {
  /** in milliseconds */
  ttl?: number;
  /** in bytes */
  maxSize?: number;
}

export class DidCacheKV implements DidCache {
  namespace: KVNamespace;
  ttl: number;
  maxSize: number;

  constructor(namespace: KVNamespace, options: DidCacheKVOptions = {}) {
    this.namespace = namespace;
    this.ttl = options.ttl ?? DEFAULT_TTL;
    this.maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
  }

  async get(key: Did): Promise<DidDocument | undefined> {
    const value = await this.namespace.get(key);
    if (value === null) {
      return undefined;
    } else {
      return JSON.parse(value);
    }
  }

  async set(key: Did, value: DidDocument): Promise<void> {
    await this.namespace.put(key, JSON.stringify(value), {
      expirationTtl: Math.round(this.ttl / 1000),
    });
  }

  async del(key: Did): Promise<void> {
    await this.namespace.delete(key);
  }
}
