import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DestinationImage } from "../../components/destination-image";
import { places } from "../../data/places";
import { getUserDestinations } from "../../services/storage";
import type { Destination } from "../../types/destination";

const categories = [
  "All",
  "Nature",
  "Beach",
  "Historical",
  "Wildlife",
] as const;

type CategoryFilter = (typeof categories)[number];
type SortOption = "Name" | "District";
type ViewMode = "Grid" | "List";

const COLORS = {
  background: "#F7F5EF",
  forest: "#173F35",
  green: "#285D4C",
  gold: "#C9A45C",
  ivory: "#FFFFFF",
  muted: "#82918A",
  border: "#E8E5DC",
  lightGreen: "#E6EFE8",
};

export default function ExploreScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { width } = useWindowDimensions();

  const initialCategory: CategoryFilter =
    typeof category === "string" &&
    categories.includes(category as CategoryFilter)
      ? (category as CategoryFilter)
      : "All";

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>(initialCategory);
  const [userPlaces, setUserPlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("Name");
  const [viewMode, setViewMode] = useState<ViewMode>("Grid");

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [category]);

  const loadUserPlaces = useCallback(async () => {
    try {
      setLoading(true);
      const storedPlaces = await getUserDestinations();
      setUserPlaces(storedPlaces);
    } catch (error) {
      console.error("Error loading destinations:", error);
      setUserPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserPlaces();
    }, [loadUserPlaces]),
  );

  const allPlaces = useMemo(() => [...places, ...userPlaces], [userPlaces]);

  const filteredPlaces = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    const result = allPlaces.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(search) ||
        place.district.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" || place.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      }

      return a.district.localeCompare(b.district);
    });
  }, [allPlaces, searchText, selectedCategory, sortBy]);

  const cardWidth = width >= 1000 ? "31.8%" : width >= 650 ? "48.5%" : "100%";

  const openDestination = (id: number) => {
    router.push(`/place/${id}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>DISCOVER THE ISLAND</Text>
          <Text style={styles.pageTitle}>Explore Sri Lanka</Text>
          <Text style={styles.headerSubtitle}>
            Find places worth remembering.
          </Text>
        </View>

        <Pressable style={styles.addButton} onPress={() => router.push("/add")}>
          <Text style={styles.addButtonText}>+ Add Place</Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations or districts..."
          placeholderTextColor="#98A29C"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />

        {searchText.length > 0 && (
          <Pressable onPress={() => setSearchText("")}>
            <Text style={styles.clearButton}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Categories */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Explore by category</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((item) => {
          const active = selectedCategory === item;

          return (
            <Pressable
              key={item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.categoryButton,
                active && styles.activeCategoryButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  active && styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.sectionTitle}>Destinations</Text>
          <Text style={styles.resultsSubtitle}>
            {filteredPlaces.length} places to discover
          </Text>
        </View>

        <View style={styles.viewControls}>
          <Pressable
            style={[
              styles.viewButton,
              viewMode === "Grid" && styles.activeViewButton,
            ]}
            onPress={() => setViewMode("Grid")}
          >
            <Text
              style={[
                styles.viewButtonText,
                viewMode === "Grid" && styles.activeViewButtonText,
              ]}
            >
              ▦
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.viewButton,
              viewMode === "List" && styles.activeViewButton,
            ]}
            onPress={() => setViewMode("List")}
          >
            <Text
              style={[
                styles.viewButtonText,
                viewMode === "List" && styles.activeViewButtonText,
              ]}
            >
              ☰
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Sort */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>SORT BY</Text>

        {(["Name", "District"] as SortOption[]).map((option) => (
          <Pressable
            key={option}
            onPress={() => setSortBy(option)}
            style={[
              styles.sortButton,
              sortBy === option && styles.activeSortButton,
            ]}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === option && styles.activeSortButtonText,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Destination cards */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.green}
          style={styles.loader}
        />
      ) : filteredPlaces.length > 0 ? (
        <View style={styles.destinationContainer}>
          {filteredPlaces.map((place) => (
            <Pressable
              key={place.id}
              style={[
                styles.destinationCard,
                {
                  width: viewMode === "List" ? "100%" : cardWidth,
                  flexDirection: viewMode === "List" ? "row" : "column",
                },
              ]}
              onPress={() => openDestination(place.id)}
            >
              <View
                style={[
                  styles.imageContainer,
                  viewMode === "List" && styles.listImageContainer,
                ]}
              >
                <DestinationImage
                  name={place.name}
                  category={place.category}
                  style={styles.destinationImage}
                />

                <View style={styles.imageBadge}>
                  <Text style={styles.imageBadgeText}>{place.category}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.destinationName} numberOfLines={1}>
                  {place.name}
                </Text>

                <Text style={styles.districtText}>
                  ◉ {place.district} District
                </Text>

                <Text
                  style={styles.description}
                  numberOfLines={viewMode === "List" ? 3 : 2}
                >
                  {place.description}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.detailsText}>Explore place →</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⌕</Text>
          <Text style={styles.emptyTitle}>No places found</Text>
          <Text style={styles.emptySubtitle}>
            Try another search or category.
          </Text>

          <Pressable
            style={styles.resetButton}
            onPress={() => {
              setSearchText("");
              setSelectedCategory("All");
            }}
          >
            <Text style={styles.resetButtonText}>Clear filters</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 60,
    alignItems: "center",
  },

  header: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2.5,
    color: COLORS.gold,
    marginBottom: 8,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.forest,
  },

  headerSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 7,
  },

  addButton: {
    backgroundColor: COLORS.forest,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
  },

  addButtonText: {
    color: COLORS.ivory,
    fontSize: 13,
    fontWeight: "700",
  },

  searchContainer: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.ivory,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },

  searchIcon: {
    fontSize: 27,
    color: COLORS.green,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.forest,
    height: "100%",
  },

  clearButton: {
    color: COLORS.muted,
    fontSize: 17,
    padding: 8,
  },

  sectionHeader: {
    width: "100%",
    maxWidth: 1200,
    marginTop: 32,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.forest,
  },

  categoryContainer: {
    width: "100%",
    maxWidth: 1200,
    paddingBottom: 8,
  },

  categoryButton: {
    paddingHorizontal: 19,
    paddingVertical: 11,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.ivory,
    marginRight: 10,
  },

  activeCategoryButton: {
    backgroundColor: COLORS.forest,
    borderColor: COLORS.forest,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.green,
  },

  activeCategoryText: {
    color: COLORS.ivory,
  },

  resultsHeader: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },

  resultsSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
  },

  viewControls: {
    flexDirection: "row",
    backgroundColor: "#ECEAE2",
    borderRadius: 10,
    padding: 3,
  },

  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },

  activeViewButton: {
    backgroundColor: COLORS.forest,
  },

  viewButtonText: {
    fontSize: 17,
    color: COLORS.muted,
  },

  activeViewButtonText: {
    color: COLORS.ivory,
  },

  sortContainer: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },

  sortLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: COLORS.muted,
    marginRight: 5,
  },

  sortButton: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#ECEAE2",
  },

  activeSortButton: {
    backgroundColor: COLORS.lightGreen,
  },

  sortButtonText: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: "600",
  },

  activeSortButtonText: {
    color: COLORS.forest,
  },

  destinationContainer: {
    width: "100%",
    maxWidth: 1200,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
  },

  destinationCard: {
    backgroundColor: COLORS.ivory,
    borderRadius: 17,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  imageContainer: {
    width: "100%",
    height: 190,
    position: "relative",
    backgroundColor: COLORS.lightGreen,
  },

  listImageContainer: {
    width: "36%",
    height: 155,
  },

  destinationImage: {
    width: "100%",
    height: "100%",
  },

  imageBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.ivory,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  imageBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.forest,
  },

  cardContent: {
    flex: 1,
    padding: 15,
  },

  destinationName: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.forest,
  },

  districtText: {
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

  cardFooter: {
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  detailsText: {
    fontSize: 12,
    color: COLORS.green,
    fontWeight: "800",
  },

  loader: {
    marginTop: 60,
  },

  emptyContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 65,
  },

  emptyIcon: {
    fontSize: 45,
    color: COLORS.gold,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: COLORS.forest,
    marginTop: 15,
  },

  emptySubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 8,
  },

  resetButton: {
    backgroundColor: COLORS.forest,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 10,
    marginTop: 20,
  },

  resetButtonText: {
    color: COLORS.ivory,
    fontWeight: "700",
    fontSize: 12,
  },
});
