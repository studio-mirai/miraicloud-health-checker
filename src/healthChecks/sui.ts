import ky from "ky";

export async function checkSuiRpcNode(url: string): Promise<number> {
  const response = await ky(url, {
    timeout: 5000,
    retry: {
      limit: 3,
      methods: ["get"],
    },
  }).text();

  const checkpointLine = response
    .split("\n")
    .find((line) => /^highest_synced_checkpoint\s\d+$/.test(line));

  if (!checkpointLine) {
    throw new Error("highest_synced_checkpoint metric not found");
  }

  const match = checkpointLine.match(/\d+$/);
  if (!match) {
    throw new Error("Could not extract checkpoint number");
  }

  return parseInt(match[0], 10);
}

export async function checkSuiValidatorNode(url: string): Promise<number> {
  const response = await ky(url, {
    timeout: 5000,
    retry: {
      limit: 3,
      methods: ["get"],
    },
  }).text();

  const lastExecutedCheckpointTimestampLine = response
    .split("\n")
    .find((line) => /^last_executed_checkpoint_timestamp_ms\s\d+$/.test(line));

  if (!lastExecutedCheckpointTimestampLine) {
    throw new Error("highest_synced_checkpoint metric not found");
  }

  const match = lastExecutedCheckpointTimestampLine.match(/\d+$/);
  if (!match) {
    throw new Error("Could not extract timestamp.");
  }

  return parseInt(match[0], 10);
}
