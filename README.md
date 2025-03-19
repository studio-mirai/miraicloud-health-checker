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
curl -i https://check.mirai.cloud/walrus/storage/https/storage.mainnet.walrus.mirai.cloud:9185
HTTP/2 200
date: Wed, 19 Mar 2025 04:21:36 GMT
content-type: text/plain; charset=UTF-8
content-length: 2
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=4OY88tvV6slzEU%2BlEfEAorHhflKr3LaEP0nGlvBlPJJtdx%2FEU6cA0NpzRUR29cKLrLJA4xuWVo7u112gL1OqB20rm0lRV92p9wn95z4TUROM7IOp8to2Bt2qZC%2BF0UqSmRXtBG%2BcHR8FawSqDF9o"}],"group":"cf-nel","max_age":604800}
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
server: cloudflare
cf-ray: 922a2efb6b00d50c-NRT
server-timing: cfL4;desc="?proto=TCP&rtt=33472&min_rtt=31668&rtt_var=12032&sent=7&recv=10&lost=0&retrans=0&sent_bytes=2893&recv_bytes=615&delivery_rate=89094&cwnd=253&unsent_bytes=0&cid=74b1363f2e606b30&ts=4062&x=0"

OK
```
