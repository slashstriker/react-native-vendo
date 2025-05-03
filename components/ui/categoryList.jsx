import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const categories = [
  { id: "1", name: "Furniture", icon: "bed-outline" },
  { id: "2", name: "Cars", icon: "car-sport-outline" },
  { id: "3", name: "Cameras", icon: "camera-outline" },
  { id: "4", name: "Games", icon: "game-controller-outline" },
  { id: "5", name: "Clothing", icon: "shirt-outline" },
  { id: "6", name: "Sports", icon: "basketball-outline" },
  { id: "7", name: "Movies & Music", icon: "musical-notes-outline" },
  { id: "8", name: "Books", icon: "book-outline" },
  { id: "9", name: "Other", icon: "ellipsis-horizontal-circle-outline" },
  { id: "10", name: "Electronics", icon: "phone-portrait-outline" },
  { id: "11", name: "Home Appliances", icon: "tv-outline" },
  { id: "12", name: "Toys", icon: "extension-puzzle-outline" },
  { id: "13", name: "Bicycles", icon: "bicycle-outline" },
  { id: "14", name: "Tools", icon: "construct-outline" },
  { id: "15", name: "Pet Supplies", icon: "paw-outline" },
  { id: "16", name: "Mobile Phones", icon: "call-outline" },
  { id: "17", name: "Watches", icon: "watch-outline" },
  { id: "18", name: "Beauty & Personal Care", icon: "flower-outline" },
  { id: "19", name: "Office Equipment", icon: "laptop-outline" },
  { id: "20", name: "Real Estate", icon: "home-outline" },
];

function CategoryList({ visible, onClose, onSelect }) {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Select a Category</Text>
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => onSelect(item.name)}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color="#555"
                  style={styles.icon}
                />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    height: "70%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#FF5252",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CategoryList;
