import React from "react";
import { StyleSheet, ActivityIndicator, View, Dimensions } from "react-native";

function Loader  () {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FF5252" />
    </View>
  );
};

export default Loader;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
