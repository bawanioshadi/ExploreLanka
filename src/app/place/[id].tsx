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
import { DestinationImage } from "../../components/destination-image";
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

        const storedData = await AsyncStorage.getItem(STORAGE_KEY);

        const userPlaces: Destination[] = storedData
          ? JSON.parse(storedData)
          : [];

        const allPlaces: Destination[] = [...places, ...userPlaces];

        const selectedPlace = allPlaces.find((item) => item.id === Number(id));

        setPlace(selectedPlace || null);

        const savedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

        if (savedFavorites) {
          setFavoriteIds(JSON.parse(savedFavorites));
        } else {
          setFavoriteIds([]);
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#087F70" />
        <Text style={styles.loadingText}>Loading destination...</Text>
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
        {/* Destination Image */}
        <DestinationImage
          name={place.name}
          category={place.category}
          style={styles.destinationImage}
        />

        {/* Destination Name */}
        <Text style={styles.title}>{place.name}</Text>

        {/* Destination Information */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>📍 District</Text>
          <Text style={styles.value}>{place.district}</Text>

          <Text style={styles.label}>🏷️ Category</Text>
          <Text style={styles.value}>{place.category}</Text>

          <Text style={styles.label}>📝 Description</Text>
          <Text style={styles.value}>{place.description}</Text>

          <Text style={styles.label}>🕒 Best Time to Visit</Text>
          <Text style={styles.value}>{place.bestTime}</Text>

          <Text style={styles.label}>🎟️ Entry Fee</Text>
          <Text style={styles.value}>{place.entryFee}</Text>
        </View>

        {/* Favorite Button */}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 12,
    color: "#666666",
    fontSize: 15,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },
  destinationImage: {
    width: "100%",
    height: 300,
    borderRadius: 22,
    marginBottom: 22,
    overflow: "hidden",
  },
  title: {
    fontSize: 31,
    fontWeight: "800",
    marginBottom: 15,
    color: "#183A34",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5ECE9",
    shadowColor: "#153C35",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginTop: 18,
    color: "#087F70",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    marginTop: 6,
    color: "#344B45",
    lineHeight: 24,
  },
  favoriteButton: {
    backgroundColor: "#087F70",
    padding: 16,
    borderRadius: 14,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#087F70",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
