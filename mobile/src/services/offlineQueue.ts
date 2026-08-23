import AsyncStorage from "@react-native-async-storage/async-storage";

const QUEUE_KEY = "@edgesync/event_queue";
const CONFIG_KEY = "@edgesync/config_cache";

export interface QueuedEvent {
  eventId: string;
  organizationId: string;
  packageId: string;
  driverId: string;
  deviceId: string;
  eventTypeId: string;
  deliveryTypeId: string;
  eventTimestamp: string;
  latitude?: number;
  longitude?: number;
  gpsAccuracy?: number;
  sequenceNumber?: number;
  createdOffline: boolean;
  syncAttempt: number;
  source: "MOBILE";
}

export async function enqueueEvent(event: QueuedEvent): Promise<void> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  const queue: QueuedEvent[] = raw ? JSON.parse(raw) : [];
  // Idempotent: skip if same eventId already present
  if (queue.some((e) => e.eventId === event.eventId)) return;
  queue.push(event);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function getQueue(): Promise<QueuedEvent[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function removeFromQueue(eventId: string): Promise<void> {
  const queue = await getQueue();
  const next = queue.filter((e) => e.eventId !== eventId);
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
}

export async function incrementAttempt(eventId: string): Promise<void> {
  const queue = await getQueue();
  const next = queue.map((e) =>
    e.eventId === eventId ? { ...e, syncAttempt: e.syncAttempt + 1 } : e
  );
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(next));
}

export async function cacheConfig(config: object): Promise<void> {
  await AsyncStorage.setItem(
    CONFIG_KEY,
    JSON.stringify({ config, lastConfigSyncAt: new Date().toISOString(), configVersion: "1" })
  );
}

export async function getCachedConfig(): Promise<any | null> {
  const raw = await AsyncStorage.getItem(CONFIG_KEY);
  return raw ? JSON.parse(raw) : null;
}
