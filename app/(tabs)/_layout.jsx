import { Stack, Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#FA5158",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="addListing"
        options={{
          title: "",
          tabBarButton: (props) => (
            <TouchableOpacity {...props} style={styles.addButton}>
              <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 100,
    backgroundColor: "#FA5158",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Removes it from tab bar's default layout
    bottom: 5, // Raises it above the tab bar
    alignSelf: "center", // Centers it horizontally
    borderWidth: 10,
    borderColor: "white",
  },
});
