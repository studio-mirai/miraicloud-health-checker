import { Hono } from "hono";
import { checkWalrusStorageNode } from "./healthChecks/walrus";
import {
  DEFAULT_INTERVAL,
  DEFAULT_ITERATIONS,
  MAX_ITERATIONS,
  MIN_ITERATIONS,
  MIN_INTERVAL,
  MAX_INTERVAL,
} from "./constants";
import { checkSuiRpcNode, checkSuiValidatorNode } from "./healthChecks/sui";

const app = new Hono();

export class Network {
  constructor(
    public readonly name: string,
    public readonly services: Service[]
  ) {}

  getService(name: string): Service | undefined {
    return this.services.find((s) => s.name === name);
  }
}

export interface Service {
  name: string;
  check: (url: string) => Promise<number>;
}

export const networks = {
  sui: new Network("sui", [
    {
      name: "rpc",
      check: checkSuiRpcNode,
    },
    {
      name: "validator",
      check: checkSuiValidatorNode,
    },
  ]),
  walrus: new Network("walrus", [
    {
      name: "storage",
      check: checkWalrusStorageNode,
    },
  ]),
};

interface HealthCheckRequest {
  networkName: string;
  serviceName: string;
  url: string;
}

app.post("/", async (c): Promise<Response> => {
  const body = await c.req.json<HealthCheckRequest>();
  const { networkName, serviceName, url } = body;

  if (!networkName || !serviceName || !url) {
    return c.json({ error: "Missing required fields." }, 400);
  }

  const network = networks[networkName as keyof typeof networks];

  if (!network) {
    return c.text("Network not supported", 400);
  }

  const service = network.getService(serviceName);

  if (!service) {
    return c.text("Service not supported", 400);
  }

  let interval = Number(c.req.query("interval")) || DEFAULT_INTERVAL;
  let iterations = Number(c.req.query("iterations")) || DEFAULT_ITERATIONS;

  iterations =
    Math.min(Math.max(iterations, MIN_ITERATIONS), MAX_ITERATIONS) ||
    DEFAULT_ITERATIONS;

  interval =
    Math.min(Math.max(interval, MIN_INTERVAL), MAX_INTERVAL) ||
    DEFAULT_INTERVAL;

  const healthCheckResults: number[] = [];
  for (let i = 0; i < iterations; i++) {
    try {
      const check = await service.check(url);
      console.log(check);
      healthCheckResults.push(check);
      if (i < iterations - 1) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Health check failed: ${error}`);
        return c.text(`Health check failed: ${error.message}`, 503);
      }
      console.error(`Health check failed: ${String(error)}`);
      return c.text(`Health check failed: ${String(error)}`, 503);
    }
  }

  healthCheckResults.sort((a, b) => a - b);

  if (healthCheckResults.at(-1)! <= healthCheckResults.at(0)!) {
    return c.text("Service is not healthy", 503);
  }

  return c.text("OK", 200);
});

export default app;
