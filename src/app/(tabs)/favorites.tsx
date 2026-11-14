import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { DestinationImage } from "../../components/destination-image";
import { places } from "../../data/places";
import {
  getFavoriteIds,
  getUserDestinations,
  removeFavorite,
} from "../../services/storage";
import type { Destination } from "../../types/destination";

const COLORS = {
  background: "#F7F5EF",
  forest: "#173F35",
  green: "#285D4C",
  gold: "#C9A45C",
  white: "#FFFFFF",
  muted: "#82918A",
  border: "#E8E5DC",
  lightGreen: "#E6EFE8",
  lightRed: "#FFF4F1",
  red: "#A84F43",
};

export default function FavoritesScreen() {
  const [favoritePlaces, setFavoritePlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const { width } = useWindowDimensions();

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);

      const [favoriteIds, userPlaces] = await Promise.all([
        getFavoriteIds(),
        getUserDestinations(),
      ]);

      const allPlaces: Destination[] = [...places, ...userPlaces];

      const filteredFavorites = allPlaces.filter((place) =>
        favoriteIds.includes(place.id),
      );

      setFavoritePlaces(filteredFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavoritePlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  const handleRemoveFavorite = async (placeId: number) => {
    try {
      setRemovingId(placeId);

      await removeFavorite(placeId);

      setFavoritePlaces((previousPlaces) =>
        previousPlaces.filter((place) => place.id !== placeId),
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const cardWidth = width >= 1000 ? "31.8%" : width >= 650 ? "48.5%" : "100%";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Page Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR PERSONAL COLLECTION</Text>
            <Text style={styles.title}>Saved Places</Text>
            <Text style={styles.subtitle}>Keep the places you love close.</Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countNumber}>{favoritePlaces.length}</Text>
            <Text style={styles.countLabel}>SAVED</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <DestinationImage name="Unawatuna" style={styles.heroImage} />

          <View style={styles.heroShade} />

          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>YOUR TRAVEL WISHLIST</Text>

            <Text style={styles.heroTitle}>
              Every journey starts with a saved place.
            </Text>

            <Text style={styles.heroSubtitle}>
              Collect beautiful destinations and discover them whenever you are
              ready.
            </Text>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your collection</Text>
            <Text style={styles.sectionSubtitle}>
              {favoritePlaces.length} destinations saved
            </Text>
          </View>

          <Pressable onPress={() => router.navigate("/(tabs)/explore")}>
            <Text style={styles.exploreLink}>Discover more →</Text>
          </Pressable>
        </View>

        {/* Loading */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.green}
            style={styles.loader}
          />
        ) : favoritePlaces.length > 0 ? (
          <View style={styles.destinationContainer}>
            {favoritePlaces.map((place) => (
              <View key={place.id} style={[styles.card, { width: cardWidth }]}>
                <Pressable
                  onPress={() => router.push(`/place/${place.id}`)}
                  style={styles.cardPressable}
                >
                  <View style={styles.imageContainer}>
                    <DestinationImage
                      name={place.name}
                      category={place.category}
                      style={styles.destinationImage}
                    />

                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>
                        {place.category}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.placeName} numberOfLines={1}>
                      {place.name}
                    </Text>

                    <Text style={styles.location}>
                      ◉ {place.district} District
                    </Text>

                    <Text style={styles.description} numberOfLines={2}>
                      {place.description}
                    </Text>

                    <View style={styles.detailsRow}>
                      <Text style={styles.viewDetails}>View Details →</Text>
                    </View>
                  </View>
                </Pressable>

                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.removeButton}
                    onPress={() => handleRemoveFavorite(place.id)}
                    disabled={removingId === place.id}
                  >
                    <Text style={styles.removeButtonText}>
                      {removingId === place.id
                        ? "Removing..."
                        : "♥  Remove from Saved"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Text style={styles.emptyIcon}>♡</Text>
            </View>

            <Text style={styles.emptyTitle}>Your collection is waiting</Text>

            <Text style={styles.emptySubtitle}>
              You haven't saved any destinations yet. Explore Sri Lanka and save
              the places you would love to visit.
            </Text>

            <Pressable
              style={styles.exploreButton}
              onPress={() => router.navigate("/(tabs)/explore")}
            >
              <Text style={styles.exploreButtonText}>
                Explore Destinations →
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 60,
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: COLORS.gold,
    marginBottom: 8,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.forest,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 7,
  },

  countBadge: {
    width: 66,
    height: 66,
    borderRadius: 18,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
  },

  countNumber: {
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.forest,
  },

  countLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    color: COLORS.green,
    marginTop: 2,
  },

  hero: {
    width: "100%",
    maxWidth: 1200,
    height: 190,
    borderRadius: 19,
    overflow: "hidden",
    backgroundColor: COLORS.forest,
    marginBottom: 32,
  },

  heroImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },

  heroShade: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(13, 43, 35, 0.62)",
  },

  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
  },

  heroEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#E5D3A6",
    marginBottom: 9,
  },

  heroTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.white,
    maxWidth: 500,
  },

  heroSubtitle: {
    fontSize: 12,
    color: "#E7EEE9",
    marginTop: 7,
    lineHeight: 19,
    maxWidth: 500,
  },

  sectionHeader: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: COLORS.forest,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
  },

  exploreLink: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "800",
  },

  loader: {
    marginTop: 50,
  },

  destinationContainer: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardPressable: {
    width: "100%",
  },

  imageContainer: {
    height: 190,
    width: "100%",
    position: "relative",
    backgroundColor: COLORS.lightGreen,
  },

  destinationImage: {
    width: "100%",
    height: "100%",
  },

  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.forest,
  },

  cardContent: {
    padding: 15,
  },

  placeName: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.forest,
  },

  location: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 7,
  },

  description: {
    fontSize: 12,
    color: "#68766F",
    lineHeight: 19,
    marginTop: 10,
  },

  detailsRow: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  viewDetails: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "800",
  },

  cardActions: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },

  removeButton: {
    backgroundColor: COLORS.lightRed,
    borderWidth: 1,
    borderColor: "#F2DFD8",
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },

  removeButtonText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "800",
  },

  emptyContainer: {
    width: "100%",
    maxWidth: 550,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.lightGreen,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 48,
    color: COLORS.green,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: COLORS.forest,
    marginTop: 20,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },

  exploreButton: {
    backgroundColor: COLORS.forest,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 11,
    marginTop: 24,
  },

  exploreButtonText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
  },
});
