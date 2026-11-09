import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Favorites ❤️</Text>

      <Text style={styles.message}>
        Your favorite destinations will appear here.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#087F70",
  },
  message: {
    fontSize: 16,
    marginTop: 20,
    color: "#555555",
  },
});
