import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

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

export default function FavoritesScreen() {
  const [favoritePlaces, setFavoritePlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorite destinations whenever screen is focused
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);

      // Get favorite IDs
      const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      const favoriteIds: number[] = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      // Get user-added destinations
      const storedPlaces = await AsyncStorage.getItem(STORAGE_KEY);

      const userPlaces: Destination[] = storedPlaces
        ? JSON.parse(storedPlaces)
        : [];

      // Combine default and user-added destinations
      const allPlaces: Destination[] = [...places, ...userPlaces];

      // Find destinations that are in favorites
      const filteredFavorites = allPlaces.filter((place) =>
        favoriteIds.includes(place.id),
      );

      setFavoritePlaces(filteredFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  // Remove destination from favorites
  const removeFavorite = async (placeId: number) => {
    try {
      const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

      const currentIds: number[] = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      const updatedIds = currentIds.filter((id) => id !== placeId);

      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedIds));

      setFavoritePlaces((previousPlaces) =>
        previousPlaces.filter((place) => place.id !== placeId),
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Favorites ❤️</Text>

      <Text style={styles.subtitle}>
        Your favourite Sri Lankan destinations.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#087F70" style={styles.loader} />
      ) : favoritePlaces.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {favoritePlaces.map((place) => (
            <View key={place.id} style={styles.card}>
              <Pressable onPress={() => router.push(`/place/${place.id}`)}>
                <Text style={styles.placeName}>{place.name}</Text>

                <Text style={styles.location}>{place.district} District</Text>

                <Text style={styles.category}>{place.category}</Text>

                <Text style={styles.description} numberOfLines={2}>
                  {place.description}
                </Text>

                <Text style={styles.viewDetails}>View Details →</Text>
              </Pressable>

              <Pressable
                style={styles.removeButton}
                onPress={() => removeFavorite(place.id)}
              >
                <Text style={styles.removeButtonText}>
                  ❤️ Remove from Favorites
                </Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>

          <Text style={styles.message}>No favorite destinations yet.</Text>

          <Text style={styles.hint}>
            Explore places and add your favorites!
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => router.navigate("/(tabs)/explore")}
          >
            <Text style={styles.exploreButtonText}>Explore Destinations</Text>
          </Pressable>
        </View>
      )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 20,
  },
  loader: {
    marginTop: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#087F70",
  },
  location: {
    fontSize: 15,
    color: "#666666",
    marginTop: 8,
  },
  category: {
    fontSize: 15,
    marginTop: 5,
    color: "#333333",
  },
  description: {
    fontSize: 14,
    color: "#555555",
    marginTop: 8,
    lineHeight: 20,
  },
  viewDetails: {
    color: "#087F70",
    fontWeight: "bold",
    marginTop: 12,
  },
  removeButton: {
    backgroundColor: "#FFF0F0",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 55,
    color: "#087F70",
  },
  message: {
    fontSize: 17,
    marginTop: 15,
    color: "#555555",
    fontWeight: "bold",
  },
  hint: {
    fontSize: 14,
    marginTop: 8,
    color: "#888888",
    textAlign: "center",
  },
  exploreButton: {
    backgroundColor: "#087F70",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginTop: 20,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
