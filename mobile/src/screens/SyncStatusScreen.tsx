import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getQueue, QueuedEvent } from "../services/offlineQueue";
import { syncQueue } from "../services/syncService";

export default function SyncStatusScreen() {
  const [queue, setQueue] = useState<QueuedEvent[]>([]);
  const [status, setStatus] = useState("");

  const refresh = () => getQueue().then(setQueue);

  useEffect(() => {
    refresh();
  }, []);

  const doSync = async () => {
    setStatus("Syncing...");
    // Demo: simulate successful upload
    const result = await syncQueue(async (event) => {
      // In production call Firebase callable
      console.log("Uploading", event.eventId);
      return { status: "CREATED" };
    });
    setStatus(`Synced: ${result.synced}, Failed: ${result.failed}, Remaining: ${result.remaining}`);
    refresh();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={doSync}>
        <Text style={styles.btnText}>Sync Now</Text>
      </TouchableOpacity>
      {status ? <Text style={styles.status}>{status}</Text> : null}
      <FlatList
        data={queue}
        keyExtractor={(item) => item.eventId}
        ListEmptyComponent={<Text style={styles.empty}>Queue is empty</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.id}>{item.eventId}</Text>
            <Text style={styles.meta}>
              {item.packageId} · {item.eventTypeId} · attempt {item.syncAttempt}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f1419" },
  btn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  status: { color: "#22c55e", marginBottom: 12, fontSize: 13 },
  empty: { color: "#8b9cb3", textAlign: "center", marginTop: 40 },
  row: {
    backgroundColor: "#1a2332",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  id: { color: "#e8eef7", fontWeight: "600", fontSize: 13 },
  meta: { color: "#8b9cb3", fontSize: 12, marginTop: 4 },
});
