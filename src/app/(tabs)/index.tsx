import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DestinationImage } from "../../components/destination-image";
import { places } from "../../data/places";
import { getUserDestinations } from "../../services/storage";
import type { Destination, DestinationCategory } from "../../types/destination";

const COLORS = {
  forest: "#183D32",
  forestLight: "#285746",
  ivory: "#F8F6EF",
  white: "#FFFFFF",
  gold: "#C6A45C",
  text: "#24352E",
  muted: "#89948B",
  border: "#E8E5DA",
  softGreen: "#EAF0E9",
};

const categories: {
  name: DestinationCategory;
  icon: string;
  cover: string;
}[] = [
  { name: "Nature", icon: "🌿", cover: "Ella" },
  { name: "Beach", icon: "🏖️", cover: "Mirissa" },
  { name: "Historical", icon: "🏛️", cover: "Sigiriya" },
  { name: "Wildlife", icon: "🐘", cover: "Yala National Park" },
];

export default function HomeScreen() {
  const [userPlaces, setUserPlaces] = useState<Destination[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUserPlaces = useCallback(async () => {
    try {
      setLoading(true);
      const savedPlaces = await getUserDestinations();
      setUserPlaces(savedPlaces);
    } catch (error) {
      console.error("Error loading destinations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserPlaces();
    }, [loadUserPlaces]),
  );

  const allPlaces = useMemo(() => [...userPlaces, ...places], [userPlaces]);

  const filteredPlaces = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) return [];

    return allPlaces.filter(
      (place) =>
        place.name.toLowerCase().includes(query) ||
        place.district.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query),
    );
  }, [allPlaces, searchText]);

  const featuredPlaces = allPlaces.slice(0, 4);

  const openDetails = (id: number) => {
    router.push({
      pathname: "/place/[id]",
      params: { id: String(id) },
    });
  };

  const openCategory = (category: string) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { category },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top navigation */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brandName}>
              Explore<Text style={styles.brandAccent}>Lanka</Text>
            </Text>
            <Text style={styles.brandSubtitle}>
              YOUR OFFLINE TRAVEL COMPANION
            </Text>
          </View>

          <View style={styles.countryBadge}>
            <Text style={styles.countryFlag}>🇱🇰</Text>
          </View>
        </View>

        {/* Hero section */}
        <View style={styles.hero}>
          <DestinationImage name="Sigiriya" style={styles.heroImage} />

          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
              <Text style={styles.heroTagText}>DISCOVER SRI LANKA</Text>
            </View>

            <Text style={styles.heroTitle}>
              Find your next{"\n"}great escape.
            </Text>

            <Text style={styles.heroDescription}>
              Explore hidden gems, beautiful landscapes and unforgettable places
              across the island.
            </Text>

            <Pressable
              style={styles.heroButton}
              onPress={() => openCategory("All")}
            >
              <Text style={styles.heroButtonText}>Explore destinations</Text>
              <Text style={styles.heroButtonArrow}>→</Text>
            </Pressable>
          </View>

          <View style={styles.heroDecoration}>
            <Text style={styles.heroDecorationText}>01 / SRI LANKA</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionEyebrow}>START EXPLORING</Text>
          <Text style={styles.sectionTitle}>Where would you like to go?</Text>

          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search places, districts..."
              placeholderTextColor={COLORS.muted}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <Pressable onPress={() => setSearchText("")}>
                <Text style={styles.clearSearch}>✕</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Search results */}
        {searchText.trim().length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Search results</Text>
              <Text style={styles.resultCount}>
                {filteredPlaces.length} found
              </Text>
            </View>

            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  style={styles.searchResultCard}
                  onPress={() => openDetails(place.id)}
                >
                  <DestinationImage
                    name={place.name}
                    category={place.category}
                    style={styles.searchResultImage}
                  />

                  <View style={styles.searchResultInfo}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeLocation}>
                      {place.district} District
                    </Text>
                    <Text style={styles.placeCategory}>{place.category}</Text>
                  </View>

                  <Text style={styles.cardArrow}>→</Text>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptySearch}>
                <Text style={styles.emptyIcon}>🔎</Text>
                <Text style={styles.emptyTitle}>No destinations found</Text>
                <Text style={styles.emptyDescription}>
                  Try another destination or district name.
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
            {/* Statistics */}
            <View style={styles.statsCard}>
              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>
                  {loading ? "..." : allPlaces.length}
                </Text>
                <Text style={styles.statsLabel}>DESTINATIONS</Text>
              </View>

              <View style={styles.statsDivider} />

              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>04</Text>
                <Text style={styles.statsLabel}>CATEGORIES</Text>
              </View>

              <View style={styles.statsDivider} />

              <View style={styles.statsItem}>
                <Text style={styles.statsNumber}>100%</Text>
                <Text style={styles.statsLabel}>OFFLINE</Text>
              </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionEyebrow}>FIND YOUR INTEREST</Text>
                  <Text style={styles.sectionTitle}>Explore by category</Text>
                </View>

                <Pressable onPress={() => openCategory("All")}>
                  <Text style={styles.seeAll}>View all →</Text>
                </Pressable>
              </View>

              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <Pressable
                    key={category.name}
                    style={styles.categoryCard}
                    onPress={() => openCategory(category.name)}
                  >
                    <DestinationImage
                      name={category.cover}
                      style={styles.categoryImage}
                    />

                    <View style={styles.categoryOverlay} />

                    <View style={styles.categoryContent}>
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Featured destinations */}
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionEyebrow}>HANDPICKED FOR YOU</Text>
                  <Text style={styles.sectionTitle}>Featured destinations</Text>
                </View>

                <Pressable onPress={() => openCategory("All")}>
                  <Text style={styles.seeAll}>See all →</Text>
                </Pressable>
              </View>

              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.forest}
                  style={styles.loader}
                />
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredList}
                >
                  {featuredPlaces.map((place) => (
                    <Pressable
                      key={place.id}
                      style={styles.featuredCard}
                      onPress={() => openDetails(place.id)}
                    >
                      <View style={styles.featuredImageContainer}>
                        <DestinationImage
                          name={place.name}
                          category={place.category}
                          style={styles.featuredImage}
                        />

                        <View style={styles.featuredCategoryBadge}>
                          <Text style={styles.featuredCategoryText}>
                            {place.category}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.featuredInfo}>
                        <Text style={styles.featuredName} numberOfLines={1}>
                          {place.name}
                        </Text>

                        <Text style={styles.featuredLocation}>
                          📍 {place.district} District
                        </Text>

                        <Text
                          style={styles.featuredDescription}
                          numberOfLines={2}
                        >
                          {place.description}
                        </Text>

                        <Text style={styles.detailsLink}>Discover more →</Text>
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Bottom call to action */}
            <View style={styles.bottomBanner}>
              <Text style={styles.bannerEyebrow}>
                YOUR NEXT ADVENTURE STARTS HERE
              </Text>

              <Text style={styles.bannerTitle}>
                There is more to{"\n"}Sri Lanka.
              </Text>

              <Text style={styles.bannerDescription}>
                Discover places you have never seen before.
              </Text>

              <Pressable
                style={styles.bannerButton}
                onPress={() => openCategory("All")}
              >
                <Text style={styles.bannerButtonText}>
                  Explore the island →
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
  content: {
    paddingBottom: 35,
  },
  topBar: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandName: {
    fontSize: 27,
    fontWeight: "800",
    color: COLORS.forest,
    letterSpacing: -1,
  },
  brandAccent: {
    color: COLORS.gold,
  },
  brandSubtitle: {
    fontSize: 9,
    color: COLORS.muted,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 3,
  },
  countryBadge: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryFlag: {
    fontSize: 22,
  },
  hero: {
    height: 390,
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: COLORS.forest,
    justifyContent: "flex-end",
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
  heroOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(13, 39, 30, 0.62)",
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  heroTag: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
  },
  heroTagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 37,
    lineHeight: 43,
    fontWeight: "800",
    letterSpacing: -1,
  },
  heroDescription: {
    color: "#E7EDE7",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 12,
    maxWidth: 290,
  },
  heroButton: {
    backgroundColor: COLORS.gold,
    alignSelf: "flex-start",
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 22,
  },
  heroButtonText: {
    color: COLORS.forest,
    fontSize: 13,
    fontWeight: "800",
  },
  heroButtonArrow: {
    color: COLORS.forest,
    fontSize: 18,
    fontWeight: "700",
  },
  heroDecoration: {
    position: "absolute",
    top: 22,
    right: 20,
  },
  heroDecorationText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  searchSection: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 10,
  },
  sectionEyebrow: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 7,
  },
  sectionTitle: {
    color: COLORS.forest,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  searchBox: {
    height: 54,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 16,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 25,
    color: COLORS.forest,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },
  clearSearch: {
    color: COLORS.muted,
    fontSize: 17,
    padding: 5,
  },
  statsCard: {
    marginHorizontal: 22,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: COLORS.forest,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statsItem: {
    alignItems: "center",
    flex: 1,
  },
  statsNumber: {
    color: COLORS.gold,
    fontSize: 22,
    fontWeight: "800",
  },
  statsLabel: {
    color: "#E4EAE3",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 5,
  },
  statsDivider: {
    width: 1,
    height: 33,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  section: {
    marginTop: 34,
  },
  sectionHeading: {
    paddingHorizontal: 22,
    marginBottom: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  seeAll: {
    color: COLORS.forestLight,
    fontSize: 12,
    fontWeight: "700",
    paddingBottom: 3,
  },
  categoryGrid: {
    paddingHorizontal: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  categoryCard: {
    width: "48%",
    height: 130,
    borderRadius: 13,
    overflow: "hidden",
    backgroundColor: COLORS.forest,
  },
  categoryImage: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(15, 40, 30, 0.43)",
  },
  categoryContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 13,
  },
  categoryIcon: {
    fontSize: 23,
    marginBottom: 5,
  },
  categoryName: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
  featuredList: {
    paddingHorizontal: 22,
    paddingBottom: 5,
    gap: 15,
  },
  featuredCard: {
    width: 265,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featuredImageContainer: {
    height: 165,
    backgroundColor: COLORS.softGreen,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredCategoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.ivory,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featuredCategoryText: {
    color: COLORS.forest,
    fontSize: 10,
    fontWeight: "800",
  },
  featuredInfo: {
    padding: 15,
  },
  featuredName: {
    color: COLORS.forest,
    fontSize: 17,
    fontWeight: "800",
  },
  featuredLocation: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 7,
  },
  featuredDescription: {
    color: "#69766D",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },
  detailsLink: {
    color: COLORS.forestLight,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 13,
  },
  loader: {
    paddingVertical: 30,
  },
  bottomBanner: {
    marginHorizontal: 22,
    marginTop: 35,
    padding: 24,
    borderRadius: 17,
    backgroundColor: COLORS.softGreen,
  },
  bannerEyebrow: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  bannerTitle: {
    color: COLORS.forest,
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
    marginTop: 12,
  },
  bannerDescription: {
    color: "#68776D",
    fontSize: 13,
    marginTop: 10,
  },
  bannerButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.forest,
    paddingHorizontal: 17,
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 20,
  },
  bannerButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  searchResultCard: {
    marginHorizontal: 22,
    marginBottom: 12,
    padding: 10,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchResultImage: {
    width: 88,
    height: 82,
    borderRadius: 9,
  },
  searchResultInfo: {
    flex: 1,
    paddingHorizontal: 13,
  },
  placeName: {
    color: COLORS.forest,
    fontSize: 15,
    fontWeight: "800",
  },
  placeLocation: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
  },
  placeCategory: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 6,
  },
  cardArrow: {
    color: COLORS.forest,
    fontSize: 21,
    paddingHorizontal: 5,
  },
  resultCount: {
    color: COLORS.muted,
    fontSize: 11,
    paddingBottom: 3,
  },
  emptySearch: {
    alignItems: "center",
    paddingVertical: 35,
    marginHorizontal: 22,
    backgroundColor: COLORS.white,
    borderRadius: 14,
  },
  emptyIcon: {
    fontSize: 30,
  },
  emptyTitle: {
    color: COLORS.forest,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },
});
