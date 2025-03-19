import ky from "ky";

interface WalrusStorageNotResponseUptime {
  secs: number;
  nanos: number;
}

interface WalrusStorageNotResponseEventProgress {
  persisted: number;
  pending: number;
  highestFinishedEventIndex: number;
}

interface WalrusStorageNotResponseShardStatus {
  unknown: number;
  ready: number;
  inTransfer: number;
  inRecovery: number;
}

interface WalrusStorageNotResponseShardSummary {
  owned: number;
  ownedShardStatus: WalrusStorageNotResponseShardStatus;
  readOnly: number;
}

interface WalrusStorageNotResponseData {
  uptime: WalrusStorageNotResponseUptime;
  epoch: number;
  publicKey: string;
  nodeStatus: "Standby" | "Active"; // Add other possible statuses if needed
  eventProgress: WalrusStorageNotResponseEventProgress;
  shardSummary: WalrusStorageNotResponseShardSummary;
}

interface WalrusStorageNodeResponse {
  success: {
    code: number;
    data: WalrusStorageNotResponseData;
  };
}

export async function checkWalrusStorageNode(url: string): Promise<number> {
  const response: WalrusStorageNodeResponse = await ky(url, {
    timeout: 5000,
    retry: {
      limit: 3,
      methods: ["get"],
    },
  }).json();

  return response.success.data.eventProgress.persisted;
}
