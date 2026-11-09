import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { places } from "../../data/places";

const FAVORITES_KEY = "favoritePlaces";

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams();

  const place = places.find((item) => item.id === Number(id));

  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem(FAVORITES_KEY);

        if (saved) {
          setFavoriteIds(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, []);

  const isFavorite = place ? favoriteIds.includes(place.id) : false;

  const toggleFavorite = async () => {
    if (!place) return;

    const updatedFavorites = isFavorite
      ? favoriteIds.filter((itemId) => itemId !== place.id)
      : [...favoriteIds, place.id];

    try {
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites),
      );

      setFavoriteIds(updatedFavorites);
    } catch (error) {
      console.log("Error saving favorites:", error);
    }
  };

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

        <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? "❤️ Remove from Favorites" : "♡ Add to Favorites"}
          </Text>
        </Pressable>
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
  favoriteButton: {
    backgroundColor: "#087F70",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  favoriteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
