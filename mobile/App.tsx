import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import CaptureEventScreen from "./src/screens/CaptureEventScreen";
import SyncStatusScreen from "./src/screens/SyncStatusScreen";
import PackageListScreen from "./src/screens/PackageListScreen";

export type RootStackParamList = {
  Home: undefined;
  CaptureEvent: { packageId?: string };
  SyncStatus: undefined;
  Packages: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#1a2332" },
          headerTintColor: "#e8eef7",
          contentStyle: { backgroundColor: "#0f1419" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "EdgeSync Driver" }} />
        <Stack.Screen name="CaptureEvent" component={CaptureEventScreen} options={{ title: "Record Event" }} />
        <Stack.Screen name="SyncStatus" component={SyncStatusScreen} options={{ title: "Sync Queue" }} />
        <Stack.Screen name="Packages" component={PackageListScreen} options={{ title: "My Packages" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
