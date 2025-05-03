import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import getToken from "../../../utils/getToken";
import Loader from "../../../components/ui/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isloading, setIsLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const getUserData = async () => {
        try {
          const token = await getToken();
          if (token) {
            const res = await fetch(
              "https://vendo-backend-production.up.railway.app/users/me",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (res.ok) {
              const data = await res.json();
              setUserData(data);
            } else {
              Alert.alert("Error", "Failed to fetch user data.");
            }
          } else {
            Alert.alert("Error", "Token not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          Alert.alert("Error", "Network error occurred.");
        }
      };

      getUserData();
    }, [])
  );

  async function handleLogout() {
    try {
      setIsLoading(true);
      const token = await getToken();
      if (token) {
        const res = await fetch(
          "https://vendo-backend-production.up.railway.app/users/logout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          await AsyncStorage.removeItem("token");
          router.replace("/login");
        } else {
          Alert.alert("Error", "Logout failed.");
        }
      }
    } catch (error) {
      console.error("Error while logging out:", error);
      Alert.alert("Error", "Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  }
  if (isloading) return <Loader />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("profile/editProfile")}>
          <Image
            source={
              userData?.profilePicture
                ? {
                    uri: `https://vendo-backend-production.up.railway.app/uploads/${userData.profilePicture}`,
                  }
                : require("../../../assets/defaultImg.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.name}>{userData?.name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push(`profile/myListings?id=${userData?.id}`)}
      >
        <View style={styles.wraper}>
          <Ionicons name="list-outline" size={24} color="#FF6B6B" />
          <Text style={styles.menuText}>My Listings</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => router.push("profile/editProfile")}
      >
        <View style={styles.wraper}>
          <Ionicons name="create-outline" size={24} color="#4D96FF" />
          <Text style={styles.menuText}>Edit Profile</Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={20} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <View style={styles.wraper}>
          <Ionicons name="log-out-outline" size={24} color="#FFD93D" />
          <Text style={styles.menuText}>Log Out</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 15,
    marginVertical: 30,
    backgroundColor: "#FF6B6B",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "white",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    fontWeight: "500",
  },
  wraper: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ProfileScreen;
