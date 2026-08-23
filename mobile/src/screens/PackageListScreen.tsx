import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Packages">;

const packages = [
  { id: "PKG-1001", state: "OUT_FOR_DELIVERY", address: "123 MG Road" },
  { id: "PKG-1002", state: "DELIVERED", address: "45 Indiranagar" },
  { id: "PKG-1003", state: "IN_TRANSIT", address: "78 Koramangala" },
];

export default function PackageListScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={packages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate("CaptureEvent", { packageId: item.id })}
          >
            <Text style={styles.id}>{item.id}</Text>
            <Text style={styles.meta}>{item.state} · {item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#0f1419" },
  row: {
    backgroundColor: "#1a2332",
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  id: { color: "#e8eef7", fontWeight: "600" },
  meta: { color: "#8b9cb3", fontSize: 13, marginTop: 4 },
});
