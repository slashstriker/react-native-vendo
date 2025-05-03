import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import Loader from "../../../components/ui/loader";
import isValidEmail from "../../../utils/emailValidtion";
import getToken from "../../../utils/getToken";

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validateForm() {
    let formErrors = {};

    if (name && name.length < 3) {
      formErrors.name = "Name must be at least 4 characters";
    }

    if (email && !isValidEmail(email)) {
      formErrors.email = "Please enter a valid email address";
    }

    if (newPassword && newPassword.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function handleSaveChanges() {
    if (!validateForm()) return;

    const payload = {};

    if (name) payload.name = name;
    if (email) payload.email = email;
    if (newPassword) payload.password = newPassword;
    if (oldPassword) payload.oldPassword = oldPassword;

    try {
      setIsLoading(true);
      const token = await getToken();
      const formData = new FormData();

      // Add profile image to the form data if selected
      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("profilePicture", {
          uri: image,
          name: filename,
          type,
        });
      }

      // Add other user details
      Object.keys(payload).forEach((key) => {
        formData.append(key, payload[key]);
      });

      const response = await fetch(
        "https://vendo-backend-production.up.railway.app/users/me",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.log("Update failed:", data);
        throw new Error(data.message || "Something went wrong");
      }

      router.back();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }
  if (isloading) return <Loader />;
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Profile</Text>

        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="person" size={42} color="#aaa" />
                <Text style={styles.uploadButtonText}>Change Avatar</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {/* Name Input */}
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <View
            style={[styles.inputContainer, errors.name && styles.errorBorder]}
          >
            <Ionicons name="person-outline" size={20} color="#777" />
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View
            style={[styles.inputContainer, errors.email && styles.errorBorder]}
          >
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

          {/* Old Password Input */}
          {errors.oldPassword && (
            <Text style={styles.errorText}>{errors.oldPassword}</Text>
          )}
          <View
            style={[
              styles.inputContainer,
              errors.oldPassword && styles.errorBorder,
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#777" />
            <TextInput
              placeholder="Old Password"
              style={styles.input}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
            />
          </View>

          {/* New Password Input */}
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <View
            style={[
              styles.inputContainer,
              errors.password && styles.errorBorder,
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#777" />
            <TextInput
              placeholder="New Password (optional)"
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.buttonText}>SAVE CHANGES</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  heading: {
    fontSize: 35,
    color: "#FF5252",
    marginBottom: 20,
  },
  form: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageSection: {
    alignItems: "center",
  },
  imagePicker: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 65,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    marginTop: 6,
    fontSize: 13,
    color: "#888",
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
  cancelText: {
    textAlign: "center",
    marginTop: 10,
    color: "gray",
    fontSize: 16,
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
