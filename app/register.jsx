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
import Loader from "../components/ui/loader";
import isValidEmail from "../utils/emailValidtion";
export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  function validateForm() {
    let formErrors = {};
    if (!name.trim()) {
      formErrors.name = "Name is required";
    }
    if (!isValidEmail(email)) {
      formErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      formErrors.password = "Password is required";
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      formErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  async function handleRegister() {
    if (validateForm()) {
      try {
        setIsLoading(true);
        const res = await fetch(
          "https://vendo-backend-production.up.railway.app/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          Alert.alert("Success", "Account Created!");
          router.replace("/login");
        } else {
          Alert.alert("Error", data.message || "Something went wrong.");
        }
      } catch (error) {
        Alert.alert("Error", "Network error. Please try again.");
        console.error("Register error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }
  if (isLoading) return <Loader />;
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Vendo</Text>
      {/* Name Field */}
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <View style={[styles.inputContainer, errors.name && styles.errorBorder]}>
        <Ionicons name="person-outline" size={20} color="#777" />
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Field */}
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <View style={[styles.inputContainer, errors.email && styles.errorBorder]}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Password Field */}
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          // !errors.password && password && isMatched && styles.matched,
          // !isMatched && styles.notMatched,
          errors.password && styles.errorBorder,
        ]}
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

      {/* Confirm Password Field */}
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          errors.confirmPassword && styles.errorBorder,
        ]}
      >
        <Ionicons name="checkmark-circle-outline" size={20} color="#777" />
        <TextInput
          placeholder="Confirm Password"
          style={[styles.input, { borderColor: "green" }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </View>

      {/* Register Button */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.registerText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
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
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#FF5252",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerText: {
    marginTop: 15,
    color: "gray",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  errorBorder: {
    borderColor: "red",
  },
});
