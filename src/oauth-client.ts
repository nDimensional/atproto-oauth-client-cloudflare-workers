import { createHash, randomBytes } from "node:crypto";
import { JoseKey } from "@atproto/jwk-jose";
import {
  HandleResolver,
  OAuthClient,
  OAuthClientFetchMetadataOptions,
  OAuthClientOptions,
  RuntimeImplementation,
  RuntimeLock,
} from "#oauth-client";
import { OAuthResponseMode } from "@atproto/oauth-types";
import {
  AtprotoHandleResolverWorkers,
  AtprotoHandleResolverWorkersOptions,
} from "./handle-resolver.js";
import {
  WorkersSavedSessionStore,
  WorkersSavedStateStore,
  toDpopKeyStore,
} from "./dpop-store.js";
import { Override } from "./util.js";

export type WorkersOAuthClientOptions = Override<
  OAuthClientOptions,
  {
    responseMode?: Exclude<OAuthResponseMode, "fragment">;

    stateStore: WorkersSavedStateStore;
    sessionStore: WorkersSavedSessionStore;

    /**
     * Used to build a {@link WorkersOAuthClientOptions.handleResolver} if none is
     * provided.
     */
    fallbackNameservers?: AtprotoHandleResolverWorkersOptions["fallbackNameservers"];

    handleResolver?: HandleResolver | string | URL;

    /**
     * Used to build a {@link WorkersOAuthClientOptions.runtimeImplementation} if
     * none is provided. Pass in `requestLocalLock` from `@atproto/oauth-client`
     * to mute warning.
     */
    requestLock?: RuntimeLock;

    runtimeImplementation?: RuntimeImplementation;
  }
>;

export type WorkersOAuthClientFromMetadataOptions =
  OAuthClientFetchMetadataOptions &
    Omit<WorkersOAuthClientOptions, "clientMetadata">;

export class WorkersOAuthClient extends OAuthClient {
  constructor({
    requestLock = undefined,
    fallbackNameservers = undefined,

    fetch,
    responseMode = "query",

    stateStore,
    sessionStore,

    handleResolver = new AtprotoHandleResolverWorkers({
      fetch,
      fallbackNameservers,
    }),

    runtimeImplementation = {
      requestLock,
      createKey: (algs) => JoseKey.generate(algs),
      getRandomValues: randomBytes,
      digest: (bytes, algorithm) =>
        createHash(algorithm.name).update(bytes).digest(),
    },

    ...options
  }: WorkersOAuthClientOptions) {
    if (!runtimeImplementation.requestLock) {
      // Ok if only one instance of the client is running at a time.
      console.warn(
        "No lock mechanism provided. Credentials might get revoked.",
      );
    }

    super({
      ...options,

      fetch,
      responseMode,
      handleResolver,
      runtimeImplementation,

      stateStore: toDpopKeyStore(stateStore),
      sessionStore: toDpopKeyStore(sessionStore),
    });
  }
}
