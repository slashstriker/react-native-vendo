import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Image,
  View,
} from "react-native";
import CategoryList from "../../../components/ui/categoryList";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import getToken from "../../../utils/getToken";
import Loader from "../../../components/ui/loader";
import { useRouter } from "expo-router";

function ListingForm() {
  // State for form inputs
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [location, setLocation] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Error state
  const [errors, setErrors] = useState({});

  // State for category modal
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // Validate form inputs
  const validateForm = () => {
    let newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(price)) {
      newErrors.price = "Price must be a number";
    }
    if (!category.trim()) newErrors.category = "Category is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!mainImage) newErrors.mainImage = "Main image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle category selection
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false);
  };

  // Pick main image
  const pickMainImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setMainImage(result.assets[0].uri);
    }
  };

  // Pick additional images
  const pickOtherImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your photos to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setOtherImages([...otherImages, ...newImages].slice(0, 4)); // Limit to 4 images
    }
  };

  // Remove additional image
  const removeOtherImage = (index) => {
    const updatedImages = [...otherImages];
    updatedImages.splice(index, 1);
    setOtherImages(updatedImages);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const token = await getToken();
      const formData = new FormData();

      // Append main image
      if (mainImage) {
        const filename = mainImage.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("mainImage", {
          uri: mainImage,
          name: filename,
          type,
        });
      }

      // Append other images
      otherImages.forEach((imageUri, index) => {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("images", {
          uri: imageUri,
          name: filename,
          type,
        });
      });
      // Append other fields
      formData.append("title", title);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("description", description || "");
      formData.append("location", location);
      formData.append("phoneNumber", phoneNumber);
      formData.append("whatsappLink", `https://wa.me/${whatsappLink.slice(1)}`);

      const response = await fetch(
        "https://vendo-backend-production.up.railway.app/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create product");
      }

      Alert.alert("Success", "Product created successfully!");
      resetForm();
      router.push(`home/${data.product.id}`);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategory("");
    setDescription("");
    setPhoneNumber("");
    setWhatsappLink("");
    setLocation("");
    setMainImage(null);
    setOtherImages([]);
    setErrors({});
  };
  if (isLoading) return <Loader />;
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.heading}>Add item</Text>

      {/* Image Upload Section */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Images</Text>

        {/* Main Image */}
        <Text style={styles.imageLabel}>Main Image (required)</Text>
        {errors.mainImage && (
          <Text style={styles.errorText}>{errors.mainImage}</Text>
        )}
        <TouchableOpacity style={styles.imagePicker} onPress={pickMainImage}>
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={30} color="#777" />
              <Text style={styles.uploadText}>Select Main Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Additional Images */}
        <Text style={styles.imageLabel}>
          Additional Images (optional, max 4)
        </Text>
        <View style={styles.additionalImagesContainer}>
          {otherImages.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri }} style={styles.additionalImagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeOtherImage(index)}
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          {otherImages.length < 4 && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={pickOtherImages}
            >
              <Ionicons name="add" size={24} color="#777" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title Input */}
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      <TextInput
        placeholder="Title"
        style={[styles.input, errors.title && styles.errorInput]}
        value={title}
        onChangeText={setTitle}
      />

      {/* Price Input */}
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        style={[styles.input, errors.price && styles.errorInput]}
        value={price}
        onChangeText={setPrice}
      />

      {/* Category Input */}
      {errors.category && (
        <Text style={styles.errorText}>{errors.category}</Text>
      )}
      <TouchableOpacity
        style={[
          styles.input,
          styles.categorySelect,
          errors.category && styles.errorInput,
        ]}
        onPress={() => setCategoryModalVisible(true)}
      >
        <Text style={{ flex: 1, color: category ? "black" : "gray" }}>
          {category || "Select Category"}
        </Text>
        <Ionicons name="chevron-down-outline" size={20} color="gray" />
      </TouchableOpacity>

      {/* Description Input */}
      <TextInput
        placeholder="Description (optional)"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Location Input */}
      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}
      <TextInput
        placeholder="Location"
        style={[styles.input, errors.location && styles.errorInput]}
        value={location}
        onChangeText={setLocation}
      />

      {/* Phone Number Input */}
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
      )}
      <TextInput
        placeholder="Phone Number"
        keyboardType="phone-pad"
        style={[styles.input, errors.phoneNumber && styles.errorInput]}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* WhatsApp Link Input */}
      <TextInput
        placeholder="WhatsApp (optional)"
        keyboardType="phone-pad"
        style={styles.input}
        value={whatsappLink}
        onChangeText={setWhatsappLink}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>POST</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity onPress={resetForm}>
        <Text style={styles.cancelText}>Reset</Text>
      </TouchableOpacity>

      {/* Category List Modal */}
      {categoryModalVisible && (
        <CategoryList
          onSelect={handleCategorySelect}
          onClose={() => setCategoryModalVisible(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 35,
    color: "#FF5252",
    marginBottom: 20,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  categorySelect: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#FF5252",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    textAlign: "center",
    marginTop: 10,
    color: "gray",
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },
  imagePicker: {
    width: "100%",
    height: 150,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 8,
    color: "#777",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  additionalImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  additionalImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListingForm;
