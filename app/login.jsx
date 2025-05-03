import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/ui/loader";
import isValidEmail from "../utils/emailValidtion";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  function validateForm() {
    let formErrors = {};

    if (!isValidEmail(email)) {
      formErrors.email = "Please enter a valid email address!";
    }
    if (!password.trim()) {
      formErrors.password = "Password is required";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  async function handleLogin() {
    if (validateForm()) {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://vendo-backend-production.up.railway.app/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );
        const data = await res.json();

        if (res.ok) {
          await AsyncStorage.setItem("token", data.token);

          router.replace("/(tabs)/home");
        } else {
          Alert.alert("Error", data.message || "Something went wrong.");
        }
      } catch (error) {
        Alert.alert("Error", "Network error. Please try again.");
        console.error("Login error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }
  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <Text style={styles.logo}>Vendo</Text>

      {/* Email input */}
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <View style={[styles.inputContainer, errors.email && styles.errorBorder]}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <View
        style={[styles.inputContainer, errors.password && styles.errorBorder]}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#777" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOG IN</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FF5252",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#FF5252",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "gray",
    marginTop: 15,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  errorBorder: {
    borderColor: "red",
  },
});
