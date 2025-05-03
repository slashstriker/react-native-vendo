import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  View,
} from "react-native";
import ImageSlider from "../../../components/ui/imageSlider";
import ImageViewer from "react-native-image-zoom-viewer";
import { Modal } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import getToken from "../../../utils/getToken";
import formatDate from "../../../utils/formDate";
import Loader from "../../../components/ui/loader";

export default function ItemDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const response = await fetch(
          `https://vendo-backend-production.up.railway.app/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Product not found"
              : "Failed to fetch product"
          );
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error opening link:", err)
    );
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return null;
  }

  // Prepare images for slider and viewer
  const allImages = [product.mainImage, ...(product.images || [])].map(
    (img) => ({
      url: `https://vendo-backend-production.up.railway.app/uploads/${img}`,
    })
  );
  return visible ? (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        imageUrls={allImages}
        enableSwipeDown={true}
        onSwipeDown={() => setVisible(false)}
        backgroundColor="rgba(0,0,0,0.9)"
      />
    </Modal>
  ) : (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageSlider
        images={allImages}
        setVisible={setVisible}
        setImageIndex={setCurrentImageIndex}
      />

      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={[styles.price, styles.wrapper]}>${product.price}</Text>

        <View style={[styles.row, styles.wrapper]}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>{product.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={16} color="#666" />
            <Text style={styles.category}>{product.category}</Text>
          </View>
        </View>

        <View style={[styles.row, styles.wrapper]}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.date}>{formatDate(product.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.seller}>
              {product.user?.name || "Unknown seller"}
            </Text>
          </View>
        </View>

        {product.description ? (
          <View style={[styles.descriptionWrapper, styles.wrapper]}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={() => openLink(`tel:${product.phoneNumber}`)}
        >
          <Ionicons name="call-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Call Seller</Text>
        </TouchableOpacity>

        {product.whatsappLink && (
          <TouchableOpacity
            style={[styles.button, styles.whatsappButton]}
            onPress={() => openLink(product.whatsappLink)}
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text style={styles.buttonText}>Chat on WhatsApp</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingBottom: 20,
  },
  details: {
    padding: 15,
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "#FF5252",
    fontWeight: "bold",
    fontSize: 18,
  },
  category: {
    color: "#555",
    marginLeft: 5,
  },
  location: {
    color: "#444",
    marginLeft: 5,
  },
  date: {
    color: "#555",
    marginLeft: 5,
  },
  seller: {
    color: "#555",
    marginLeft: 5,
  },
  descriptionWrapper: {
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  buttonContainer: {
    width: "90%",
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  callButton: {
    backgroundColor: "#FF5252",
  },
  whatsappButton: {
    backgroundColor: "#25D366",
  },
  backButton: {
    backgroundColor: "#808080",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  wrapper: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    elevation: 1,
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FF5252",
    padding: 12,
    borderRadius: 6,
  },
  retryText: {
    color: "white",
    fontWeight: "bold",
  },
});
