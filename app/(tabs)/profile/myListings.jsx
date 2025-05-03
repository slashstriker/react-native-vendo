import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import ConfirmDelete from "../../../components/ui/confirmDelete";
import getToken from "../../../utils/getToken";
import formatDate from "../../../utils/formDate";

function MyListings() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  console.log(id);
  const fetchMyListings = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `https://vendo-backend-production.up.railway.app/products?userId=${
          id && id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setItems(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyListings();
  };

  const handleConfirmDelete = (id) => {
    setIsVisible(true);
    setSelectedItem(id);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const token = await getToken();
      const response = await fetch(
        `https://vendo-backend-production.up.railway.app/products/${selectedItem}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setItems(items.filter((item) => item.id !== selectedItem));
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", err.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
      setIsVisible(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5252" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={fetchMyListings}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ConfirmDelete
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        handleDelete={handleDelete}
        loading={deleteLoading}
      />

      <Text style={styles.heading}>My Listings</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={50} color="#888" />
          <Text style={styles.notifyText}>
            You haven't listed any items yet.
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.replace("/addListing")}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addButtonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#FF5252"]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <TouchableOpacity
                style={styles.itemContent}
                onPress={() => router.push(`home/${item.id}`)}
              >
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemPrice}>${item.price}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
                <Text style={styles.itemDate}>
                  Listed: {formatDate(item.createdAt)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleConfirmDelete(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="#FF5252" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButton: {
    backgroundColor: "#FF5252",
  },
  backButton: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  notifyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#FF5252",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF5252",
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  itemDetails: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: "#FF5252",
    fontWeight: "600",
  },
  itemCategory: {
    fontSize: 14,
    color: "#666",
  },
  itemDate: {
    fontSize: 12,
    color: "#888",
  },
  deleteButton: {
    padding: 8,
  },
});

export default MyListings;
