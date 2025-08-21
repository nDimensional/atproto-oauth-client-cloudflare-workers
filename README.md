# atproto-oauth-client-cloudflare-workers

This library contains local patched copies of

- [`@atproto/oauth-client-node`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client-node)
- [`@atproto/oauth-client`](https://github.com/bluesky-social/atproto/tree/main/packages/oauth/oauth-client)
- [`@atproto-labs/handle-resolver-node`](https://github.com/bluesky-social/atproto/tree/main/packages/internal/handle-resolver-node)
- [`@atproto-labs/handle-resolver`](https://github.com/bluesky-social/atproto/tree/main/packages/internal/handle-resolver)
- [`@atproto-labs/identity-resolver`](https://github.com/bluesky-social/atproto/tree/main/packages/internal/identity-resolver)
- [`@atproto-labs/did-resolver`](https://github.com/bluesky-social/atproto/tree/main/packages/internal/did-resolver)

that are compatible with the Cloudflare Workers edge runtime.

The only changes applied throughout are:

1. replacing `request.cache: "no-cache"` with `request.headers["cache-control"]: "no-cache"`
2. replacing `request.redirect: "error"` with `request.redirect: "follow"`

DNS handle resolution requires the [`nodejs_compat` compatibility flag](https://developers.cloudflare.com/workers/runtime-apis/nodejs/).

## Usage

`WorkersOAuthClient` works mostly as a drop-in replacement for `NodeOAuthClient`.

```ts
import { WorkersOAuthClient } from "atproto-oauth-client-cloudflare-workers"

export const client = new WorkersOAuthClient({
	clientMetadata: {
	  // ...
	}
}
```

By default, like `NodeOAuthClient`, this will use an in-memory store for the handle cache and DID cache. This doesn't make much sense for the workers environment, since memory is reset after each invocation. To use Cloudflare KV namespaces for your handle and DID caches, create `DidCacheKV` and `HandleCacheKV` instances and pass them to the `WorkersOAuthClient` constructor.

Similarly, to use KV namespaces for the oauth state store and oauth session store, (which are required), import and provide `StateStoreKV` and `SessionStoreKV` instances.

```ts
import { env } from "cloudflare:workers"

import {
	WorkersOAuthClient,
	DidCacheKV,
	HandleCacheKV,
	StateStoreKV,
	SessionStoreKV,
} from "atproto-oauth-client-cloudflare-workers";

export const client = new WorkersOAuthClient({
  // did -> didDocument cache
	didCache: new DidCacheKV(env.DID_CACHE),
	// handle -> did cache
	handleCache: new HandleCacheKV(env.HANDLE_CACHE),

	clientMetadata: {
	  // Interface to store authorization state data (during authorization flows)
		stateStore: new StateStoreKV(env.OAUTH_STATE_STORE),
		// Interface to store authenticated session data
	  sessionStore: new SessionStoreKV(env.OAUTH_SESSION_STORE),

		// ...
	}
}
```
