import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { enqueueEvent, QueuedEvent } from "../services/offlineQueue";

type Props = NativeStackScreenProps<RootStackParamList, "CaptureEvent">;

const EVENT_TYPES = [
  "PICKED_UP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELIVERY_FAILED",
  "RETURNED",
];

export default function CaptureEventScreen({ navigation, route }: Props) {
  const [packageId, setPackageId] = useState(route.params?.packageId || "PKG-1001");
  const [eventType, setEventType] = useState("DELIVERED");
  const [saving, setSaving] = useState(false);

  const capture = async () => {
    setSaving(true);
    try {
      let latitude: number | undefined;
      let longitude: number | undefined;
      let gpsAccuracy: number | undefined;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
        gpsAccuracy = loc.coords.accuracy ?? undefined;
      }

      const eventId = `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const event: QueuedEvent = {
        eventId,
        organizationId: "org-edgesync-demo",
        packageId,
        driverId: "DRV-001",
        deviceId: "DEV-001",
        eventTypeId: `ET-${eventType}`,
        deliveryTypeId: "DT-STANDARD",
        eventTimestamp: new Date().toISOString(),
        latitude,
        longitude,
        gpsAccuracy,
        createdOffline: true,
        syncAttempt: 0,
        source: "MOBILE",
      };

      await enqueueEvent(event);
      Alert.alert(
        "Event Recorded",
        `Event ${eventId} saved locally.\nGPS accuracy: ${gpsAccuracy != null ? gpsAccuracy.toFixed(1) + "m" : "unavailable"}\nWill sync when online.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to capture event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.label}>Package ID</Text>
      <TextInput
        style={styles.input}
        value={packageId}
        onChangeText={setPackageId}
        placeholderTextColor="#8b9cb3"
      />

      <Text style={styles.label}>Event Type</Text>
      <View style={styles.typeRow}>
        {EVENT_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, eventType === t && styles.chipActive]}
            onPress={() => setEventType(t)}
          >
            <Text style={[styles.chipText, eventType === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, saving && { opacity: 0.6 }]}
        onPress={capture}
        disabled={saving}
      >
        <Text style={styles.btnText}>{saving ? "Saving..." : "Capture & Queue Event"}</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Works fully offline. Event is written to local queue immediately and synced later with idempotent retries.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419" },
  label: { color: "#8b9cb3", fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#243044",
    borderRadius: 8,
    padding: 12,
    color: "#e8eef7",
    fontSize: 16,
  },
  typeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#243044",
    marginBottom: 6,
  },
  chipActive: { backgroundColor: "#3b82f6" },
  chipText: { color: "#8b9cb3", fontSize: 12 },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  btn: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 28,
  },
  btnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  hint: { color: "#8b9cb3", fontSize: 12, marginTop: 16, lineHeight: 18 },
});
