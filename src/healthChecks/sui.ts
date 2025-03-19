import ky from "ky";

export async function checkSuiRpcNode(
  scheme: string,
  hostname: string
): Promise<number> {
  const response = await ky(`${scheme}://${hostname}/metrics`, {
    timeout: 5000,
    retry: {
      limit: 3,
      methods: ["get"],
    },
  }).text();

  const checkpointLine = response
    .split("\n")
    .find((line) => /^highest_synced_checkpoint\s\d+$/.test(line));
  console.log(checkpointLine);

  if (!checkpointLine) {
    throw new Error("highest_synced_checkpoint metric not found");
  }

  // Extract the number using regex
  const match = checkpointLine.match(/\d+$/);
  if (!match) {
    throw new Error("Could not extract checkpoint number");
  }

  return parseInt(match[0], 10);
}
