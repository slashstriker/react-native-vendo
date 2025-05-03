import { useRouter } from "expo-router";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import formatDate from "../../utils/formDate";

function Item({ id, title, price, location, category, mainImage, createdAt }) {
  const router = useRouter();
  const imageUrl = `https://vendo-backend-production.up.railway.app/uploads/${mainImage}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/home/${id}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.details}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title || "No Title"}
          </Text>
          {category && (
            <Text style={styles.category} numberOfLines={1}>
              {category}
            </Text>
          )}
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {location || "Unknown location"}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
          <Text style={styles.price}>${price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 6,
  },
  details: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  category: {
    backgroundColor: "#FF5252",
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF5252",
  },
});

export default Item;
