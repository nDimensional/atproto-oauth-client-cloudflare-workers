import { AtprotoHandleResolver, HandleResolver } from "#handle-resolver";
import { resolveTxtDefault, resolveTxtFactory } from "./resolve-txt-factory.js";

export type AtprotoHandleResolverWorkersOptions = {
  /**
   * List of backup nameservers to use in case the primary ones fail. Will
   * default to no fallback nameservers.
   */
  fallbackNameservers?: string[];

  /**
   * Fetch function to use for HTTP requests. Allows customizing the request
   * behavior, e.g. adding headers, setting a timeout, mocking, etc. The
   * provided fetch function will be wrapped with a safeFetchWrap function that
   * adds SSRF protection.
   *
   * @default `globalThis.fetch`
   */
  fetch?: (typeof globalThis)["fetch"];
};

export class AtprotoHandleResolverWorkers
  extends AtprotoHandleResolver
  implements HandleResolver
{
  constructor({
    fetch = globalThis.fetch,
    fallbackNameservers,
  }: AtprotoHandleResolverWorkersOptions = {}) {
    super({
      fetch: fetch,
      // fetch: safeFetchWrap({
      // 	fetch,
      // 	timeout: 3000, // 3 seconds
      // 	ssrfProtection: true,
      // 	responseMaxSize: 10 * 1048, // DID are max 2048 characters, 10kb for safety
      // }),
      resolveTxt: resolveTxtDefault,
      resolveTxtFallback: fallbackNameservers?.length
        ? resolveTxtFactory(fallbackNameservers)
        : undefined,
    });
  }
}
