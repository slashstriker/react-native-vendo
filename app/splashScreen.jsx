import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vendo </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FA5158",
  },
  text: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
  },
});
