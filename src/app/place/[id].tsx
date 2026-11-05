
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { places } from "../../data/places";

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams();

  const place = places.find((item) => item.id === Number(id));

  if (!place) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Destination not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: place.name }} />

      <View style={styles.content}>
        <Text style={styles.title}>{place.name}</Text>

        <Text style={styles.label}>District</Text>
        <Text style={styles.value}>{place.district}</Text>

        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{place.category}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{place.description}</Text>

        <Text style={styles.label}>Best Time to Visit</Text>
        <Text style={styles.value}>{place.bestTime}</Text>

        <Text style={styles.label}>Entry Fee</Text>
        <Text style={styles.value}>{place.entryFee}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#087F70",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#555555",
  },
  value: {
    fontSize: 16,
    marginTop: 5,
    color: "#222222",
  },
});
