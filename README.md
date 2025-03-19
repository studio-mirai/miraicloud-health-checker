# MiraiCloud Health Checker

This repo provides a health check proxy for Sui and Walrus node services. The proxy can be easily deployed to Cloudflare Workers for reliability and global availability. A free version of the health checker can be found at `https://check.mirai.cloud` (note that we will monitor usage on this endpoint and implement rate limiting if needed).

Each node type has a unique health check function that determines whether the node is in a healthy state. For example, the Sui RPC Node health check function checks the `highest_synced_checkpoint` of the node to determine if it's syncing correctly.

Currently, the health checker supports:

- Sui RPC Node: `/sui/<SCHEME>/<RPC_NODE_ENDPOINT>`
- Walrus Storage Node: `/walrus/<SCHEME>/<STORAGE_NODE_ENDPOINT>`

Additional services will be added in the near future:

- Sui Bridge Node
- Sui Validator Node
- Walrus Publisher Node
- Walrus Aggregator Node
