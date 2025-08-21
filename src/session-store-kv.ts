import type {
  WorkersSavedSession,
  WorkersSavedSessionStore,
} from "./dpop-store.js";
import type { KVNamespace } from "./util.js";

export class SessionStoreKV implements WorkersSavedSessionStore {
  namespace: KVNamespace;
  constructor(namespace: KVNamespace) {
    this.namespace = namespace;
  }

  async set(sub: string, session: WorkersSavedSession): Promise<void> {
    await this.namespace.put(sub, JSON.stringify(session));
  }
  async get(sub: string): Promise<WorkersSavedSession | undefined> {
    const value = await this.namespace.get(sub);
    if (value === null) {
      return undefined;
    } else {
      return JSON.parse(value);
    }
  }
  async del(sub: string): Promise<void> {
    await this.namespace.delete(sub);
  }
}
