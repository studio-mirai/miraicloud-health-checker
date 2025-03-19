# MiraiCloud Health Checker

This repo provides a health check proxy for Sui and Walrus node services. The proxy can be easily deployed to Cloudflare Workers for reliability and global availability. A free version of the health checker can be found at `https://check.mirai.cloud` (note that we will monitor usage on this endpoint and implement rate limiting if needed).

Each node type has a unique health check function that determines whether the node is in a healthy state. For example, the Sui RPC Node health check function checks the `highest_synced_checkpoint` of the node to determine if it's syncing correctly.

Currently, the health checker supports:

- Sui RPC Node
- Walrus Storage Node

Additional services will be added in the near future:

- Sui Bridge Node
- Sui Validator Node
- Walrus Publisher Node
- Walrus Aggregator Node

## Example Request

```
curl -i -X POST 'https://check.mirai.cloud' -i \
  -H "Content-Type: application/json" \
  -d '{
    "networkName": "sui",
    "serviceName": "validator",
    "url": "http://validator.mainnet.sui.mirai.cloud:9184/metrics"
  }'

HTTP/2 200
date: Wed, 19 Mar 2025 07:14:53 GMT
content-type: text/plain; charset=UTF-8
content-length: 2
report-to: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v4?s=eNCcg%2B6joTgIurTf21b%2FaGSDepb0VIV10eSgUIq64PVpAnaN1prv8mtL54LDvhGSkpYTfkzvmmKVFVelifmP%2FwHck0Lk9MqVZJPA4FtBmxUVxB%2BYASsUDcqatsyqfITjX%2BvGFDjCoIFoE9vOG6go"}],"group":"cf-nel","max_age":604800}
nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
server: cloudflare
cf-ray: 922b2cc82c86d4fb-NRT
server-timing: cfL4;desc="?proto=TCP&rtt=38087&min_rtt=29487&rtt_var=14737&sent=7&recv=10&lost=0&retrans=0&sent_bytes=2891&recv_bytes=728&delivery_rate=117176&cwnd=253&unsent_bytes=0&cid=30272d0e54abfd08&ts=5814&x=0"

OK
```
