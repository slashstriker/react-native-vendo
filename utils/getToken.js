import AsyncStorage from "@react-native-async-storage/async-storage";

function getToken() {
  return AsyncStorage.getItem("token");
}

export default getToken;
