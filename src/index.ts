import { Hono } from "hono";
import { checkSuiRpcNode } from "./healthChecks/sui";
import { checkWalrusStorageNode } from "./healthChecks/walrus";
import { Scheme } from "./types";
import { DEFAULT_INTERVAL } from "./constants";

const app = new Hono();

app.get("/sui/rpc/:scheme/:hostname", async (c) => {
  const scheme = c.req.param("scheme") as Scheme;
  const hostname = c.req.param("hostname") as string;
  const interval = Number(c.req.query("interval")) || DEFAULT_INTERVAL;

  const check1 = await checkSuiRpcNode(scheme, hostname);
  console.log(`${hostname} - ${check1}`);
  await new Promise((resolve) => setTimeout(resolve, interval));
  const check2 = await checkSuiRpcNode(scheme, hostname);
  console.log(`${hostname} - ${check2}`);

  if (check2 <= check1) {
    return c.text(`${hostname} is not syncing new checkpoints.`, 503);
  }

  return c.text("OK", 200);
});

app.get("/walrus/storage/:scheme/:hostname", async (c) => {
  const scheme = c.req.param("scheme") as Scheme;
  const hostname = c.req.param("hostname") as string;
  const interval = Number(c.req.query("interval")) || DEFAULT_INTERVAL;

  const check1 = await checkWalrusStorageNode(scheme, hostname);
  console.log(`${hostname} - ${check1}`);
  await new Promise((resolve) => setTimeout(resolve, interval));
  const check2 = await checkWalrusStorageNode(scheme, hostname);
  console.log(`${hostname} - ${check2}`);

  if (check2 <= check1) {
    return c.text(`${hostname} is not persisting new events.`, 503);
  }

  return c.text("OK", 200);
});

export default app;
