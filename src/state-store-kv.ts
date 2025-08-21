import type {
  WorkersSavedState,
  WorkersSavedStateStore,
} from "./dpop-store.js";

import type { KVNamespace } from "./util.js";

export class StateStoreKV implements WorkersSavedStateStore {
  namespace: KVNamespace;
  constructor(namespace: KVNamespace) {
    this.namespace = namespace;
  }

  async set(key: string, internalState: WorkersSavedState): Promise<void> {
    await this.namespace.put(key, JSON.stringify(internalState));
  }

  async get(key: string): Promise<WorkersSavedState | undefined> {
    const value = await this.namespace.get(key);
    if (value === null) {
      return undefined;
    } else {
      return JSON.parse(value);
    }
  }

  async del(key: string): Promise<void> {
    await this.namespace.delete(key);
  }
}
