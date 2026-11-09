import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { places } from "../../data/places";

const FAVORITES_KEY = "favoritePlaces";

export default function FavoritesScreen() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const saved = await AsyncStorage.getItem(FAVORITES_KEY);

          if (saved) {
            setFavoriteIds(JSON.parse(saved));
          } else {
            setFavoriteIds([]);
          }
        } catch (error) {
          console.log("Error loading favorites:", error);
        }
      };

      loadFavorites();
    }, []),
  );

  const favoritePlaces = places.filter((place) =>
    favoriteIds.includes(place.id),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Favorites ❤️</Text>

      {favoritePlaces.length > 0 ? (
        <ScrollView>
          {favoritePlaces.map((place) => (
            <Pressable
              key={place.id}
              style={styles.card}
              onPress={() => router.push(`/place/${place.id}`)}
            >
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.location}>{place.district} District</Text>
              <Text style={styles.category}>{place.category}</Text>
              <Text style={styles.viewDetails}>View Details →</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>♡</Text>
          <Text style={styles.message}>No favorite destinations yet.</Text>
          <Text style={styles.hint}>
            Explore places and add your favorites!
          </Text>
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
    marginBottom: 20,
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
  },
  viewDetails: {
    color: "#087F70",
    fontWeight: "bold",
    marginTop: 12,
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
  },
});
