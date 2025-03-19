# MiraiCloud Health Checker

This repo provides a health check proxy for Sui and Walrus node services.

Each node type has a unique health check function that determines whether the node is in a healthy state. For example, the Sui RPC Node health check function checks the `highest_synced_checkpoint` of the node to determine if it's syncing correctly.

Currently, the health checker supports:

- Sui RPC Node
- Walrus Storage Node

Additional services will be added in the near future:

- Sui Bridge Node
- Sui Validator Node
- Walrus Publisher Node
- Walrus Aggregator Node
