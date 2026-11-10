import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { places } from "../../data/places";

const FAVORITES_KEY = "favoritePlaces";
const STORAGE_KEY = "user_destinations";

type Destination = {
  id: number;
  name: string;
  district: string;
  category: string;
  description: string;
  bestTime: string;
  entryFee: string;
};

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [place, setPlace] = useState<Destination | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Load destination and favorites
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load user-added destinations
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);

        const userPlaces: Destination[] = storedData
          ? JSON.parse(storedData)
          : [];

        // Combine default and user-added destinations
        const allPlaces: Destination[] = [...places, ...userPlaces];

        // Find selected destination
        const selectedPlace = allPlaces.find((item) => item.id === Number(id));

        setPlace(selectedPlace || null);

        // Load favorite IDs
        const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

        if (savedFavorites) {
          setFavoriteIds(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Error loading place details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const isFavorite = place ? favoriteIds.includes(place.id) : false;

  // Add or remove favorite
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
      console.error("Error saving favorites:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#087F70" />
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Destination Not Found" }} />
        <Text style={styles.title}>Destination not found</Text>
        <Text style={styles.value}>
          This destination may have been removed or does not exist.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: place.name }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{place.name}</Text>

        <View style={styles.infoCard}>
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

        <Pressable
          style={[styles.favoriteButton, isFavorite && styles.removeButton]}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? "❤️ Remove from Favorites" : "♡ Add to Favorites"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#087F70",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
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
    lineHeight: 24,
  },
  favoriteButton: {
    backgroundColor: "#087F70",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  removeButton: {
    backgroundColor: "#555555",
  },
  favoriteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
