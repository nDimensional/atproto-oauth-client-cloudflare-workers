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

DNS handle resolution appears to work when using the [`nodejs_compat` compatibility flag](https://developers.cloudflare.com/workers/runtime-apis/nodejs/).
