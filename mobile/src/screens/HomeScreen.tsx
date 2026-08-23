import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getQueue } from "../services/offlineQueue";
import NetInfo from "@react-native-community/netinfo";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    getQueue().then((q) => setPending(q.length));
    const unsub = NetInfo.addEventListener((s) => setOnline(!!s.isConnected));
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EdgeSync Driver</Text>
      <Text style={styles.sub}>
        {online ? "Online" : "Offline — events will queue locally"}
      </Text>
      <Text style={styles.pending}>{pending} events pending sync</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("CaptureEvent", {})}
      >
        <Text style={styles.btnText}>Record Delivery Event</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnSecondary]}
        onPress={() => navigation.navigate("Packages")}
      >
        <Text style={styles.btnText}>My Packages</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, styles.btnSecondary]}
        onPress={() => navigation.navigate("SyncStatus")}
      >
        <Text style={styles.btnText}>Sync Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#0f1419" },
  title: { fontSize: 28, fontWeight: "700", color: "#e8eef7", marginBottom: 8 },
  sub: { fontSize: 14, color: "#8b9cb3", marginBottom: 4 },
  pending: { fontSize: 14, color: "#f59e0b", marginBottom: 32 },
  btn: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  btnSecondary: { backgroundColor: "#243044" },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
