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

## Example Request

```
curl -i https://check.mirai.cloud/sui/rpc/https/rpc-wnx-lax.testnet.sui.mirai.cloud
HTTP/2 200
date: Wed, 19 Mar 2025 04:26:34 GMT
content-type: text/plain; charset=UTF-8
content-length: 2
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=Cf2XzrdtI6jzeBaooy7XBiCRZuuWYechx5AAf588A%2Ba60Nd0WiyCGQEoab%2BMr1dsh7lEmuCqDBqyDY9FKXDG8zcvKQSSulejhj3r%2FR9OUfRIQtaR%2F3BMHerowp4pQIOq6Vmx0eYo%2F7k8gyM7eJT7"}],"group":"cf-nel","max_age":604800}
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
server: cloudflare
cf-ray: 922a36410896aff7-NRT
server-timing: cfL4;desc="?proto=TCP&rtt=26090&min_rtt=24857&rtt_var=9346&sent=7&recv=10&lost=0&retrans=0&sent_bytes=2892&recv_bytes=608&delivery_rate=113937&cwnd=253&unsent_bytes=0&cid=6731031a181c9655&ts=5050&x=0"

OK
```
