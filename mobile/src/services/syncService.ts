import NetInfo from "@react-native-community/netinfo";
import { getQueue, removeFromQueue, incrementAttempt } from "./offlineQueue";

const MAX_RETRIES = 5;

/**
 * Attempts to sync queued events when network is available.
 * Uses exponential backoff conceptually (caller schedules).
 * Idempotent via eventId.
 */
export async function syncQueue(
  uploadFn: (event: any) => Promise<{ status: string }>
): Promise<{ synced: number; failed: number; remaining: number }> {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    return { synced: 0, failed: 0, remaining: (await getQueue()).length };
  }

  const queue = await getQueue();
  let synced = 0;
  let failed = 0;

  for (const event of queue) {
    if (event.syncAttempt >= MAX_RETRIES) {
      failed++;
      continue;
    }
    try {
      const result = await uploadFn(event);
      if (result.status === "CREATED" || result.status === "ALREADY_EXISTS") {
        await removeFromQueue(event.eventId);
        synced++;
      } else {
        await incrementAttempt(event.eventId);
        failed++;
      }
    } catch {
      await incrementAttempt(event.eventId);
      failed++;
    }
  }

  const remaining = (await getQueue()).length;
  return { synced, failed, remaining };
}
