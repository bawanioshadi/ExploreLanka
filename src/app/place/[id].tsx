import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

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
import type { Destination } from "../../types/destination";

import {
  addFavorite,
  getFavoriteIds,
  getUserDestinations,
  removeFavorite,
} from "../../services/storage";

export default function PlaceDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [place, setPlace] = useState<Destination | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const userPlaces = await getUserDestinations();
      const allPlaces: Destination[] = [...places, ...userPlaces];

      const selectedPlace = allPlaces.find((item) => item.id === Number(id));

      setPlace(selectedPlace || null);

      const savedFavorites = await getFavoriteIds();
      setFavoriteIds(savedFavorites);
    } catch (error) {
      console.error("Error loading destination:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isFavorite = place ? favoriteIds.includes(place.id) : false;

  const toggleFavorite = async () => {
    if (!place) return;

    try {
      if (isFavorite) {
        await removeFavorite(place.id);

        setFavoriteIds((current) =>
          current.filter((itemId) => itemId !== place.id),
        );
      } else {
        await addFavorite(place.id);

        setFavoriteIds((current) =>
          current.includes(place.id) ? current : [...current, place.id],
        );
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#183F35" />
        <Text style={styles.loadingText}>Preparing your destination...</Text>
      </SafeAreaView>
    );
  }

  if (!place) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: "Destination Not Found" }} />

        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>⌖</Text>

          <Text style={styles.notFoundTitle}>Destination not found</Text>

          <Text style={styles.notFoundText}>
            This destination may have been removed or does not exist.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: place.name,
          headerStyle: {
            backgroundColor: "#F8F6EF",
          },
          headerTintColor: "#183F35",
          headerTitleStyle: {
            fontWeight: "700",
          },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Destination Image */}
        <View style={styles.imageContainer}>
          <DestinationImage
            name={place.name}
            category={place.category}
            style={styles.destinationImage}
          />

          <View style={styles.imageOverlay}>
            <Text style={styles.imageLabel}>EXPLORE SRI LANKA</Text>
          </View>
        </View>

        {/* Destination Heading */}
        <View style={styles.headingSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {place.category.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.title}>{place.name}</Text>

          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>⌖</Text>
            <Text style={styles.locationText}>{place.district}, Sri Lanka</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this destination</Text>

          <Text style={styles.description}>{place.description}</Text>
        </View>

        {/* Travel Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Information</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>◷</Text>
              </View>

              <Text style={styles.infoLabel}>BEST TIME TO VISIT</Text>

              <Text style={styles.infoValue}>{place.bestTime}</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>₨</Text>
              </View>

              <Text style={styles.infoLabel}>ENTRY FEE</Text>

              <Text style={styles.infoValue}>{place.entryFee}</Text>
            </View>
          </View>
        </View>

        {/* Location Information */}
        <View style={styles.locationCard}>
          <View style={styles.locationCardIcon}>
            <Text style={styles.locationCardEmoji}>📍</Text>
          </View>

          <View style={styles.locationCardContent}>
            <Text style={styles.locationCardTitle}>Location</Text>

            <Text style={styles.locationCardValue}>
              {place.district}, Sri Lanka
            </Text>
          </View>
        </View>

        {/* Favorite Button */}
        <Pressable
          style={({ pressed }) => [
            styles.favoriteButton,
            isFavorite && styles.removeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? "♥" : "♡"}</Text>

          <Text style={styles.favoriteButtonText}>
            {isFavorite ? "Remove from Saved Places" : "Save this Destination"}
          </Text>
        </Pressable>

        <Text style={styles.footerText}>DISCOVER MORE. TRAVEL BETTER.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6EF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F6EF",
  },

  loadingText: {
    marginTop: 14,
    color: "#64756D",
    fontSize: 14,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 45,
    width: "100%",
    maxWidth: 850,
    alignSelf: "center",
  },

  imageContainer: {
    width: "100%",
    height: 290,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E4E9E2",
    marginBottom: 25,
  },

  destinationImage: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },

  imageOverlay: {
    position: "absolute",
    bottom: 18,
    left: 18,
    backgroundColor: "rgba(24, 63, 53, 0.85)",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 8,
  },

  imageLabel: {
    color: "#F5E8C7",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  headingSection: {
    marginBottom: 27,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E8EFE8",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 30,
    marginBottom: 12,
  },

  categoryText: {
    color: "#315D49",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  title: {
    color: "#183F35",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.7,
    lineHeight: 39,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  locationIcon: {
    fontSize: 20,
    color: "#B28A45",
    marginRight: 7,
  },

  locationText: {
    fontSize: 14,
    color: "#75827A",
    fontWeight: "500",
  },

  section: {
    marginBottom: 27,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#183F35",
    marginBottom: 13,
  },

  description: {
    fontSize: 15,
    lineHeight: 26,
    color: "#596B61",
  },

  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9E9DF",
    minHeight: 155,
  },

  infoIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3EBD9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  infoIcon: {
    fontSize: 22,
    color: "#A27C3E",
    fontWeight: "700",
  },

  infoLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.9,
    color: "#849087",
    marginBottom: 8,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#25483B",
    lineHeight: 21,
  },

  locationCard: {
    backgroundColor: "#EDF1E9",
    borderRadius: 17,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  locationCardIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  locationCardEmoji: {
    fontSize: 20,
  },

  locationCardContent: {
    flex: 1,
  },

  locationCardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#25483B",
    marginBottom: 4,
  },

  locationCardValue: {
    fontSize: 13,
    color: "#718078",
  },

  favoriteButton: {
    backgroundColor: "#183F35",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#183F35",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  removeButton: {
    backgroundColor: "#8B6542",
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  favoriteIcon: {
    color: "#F5E8C7",
    fontSize: 23,
  },

  favoriteButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  footerText: {
    textAlign: "center",
    marginTop: 27,
    color: "#A49C87",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
  },

  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  notFoundIcon: {
    fontSize: 55,
    color: "#B28A45",
    marginBottom: 15,
  },

  notFoundTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#183F35",
    marginBottom: 10,
  },

  notFoundText: {
    fontSize: 14,
    color: "#75827A",
    textAlign: "center",
    lineHeight: 23,
  },
});
