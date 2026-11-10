import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

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
import { places } from "../../data/places";

const STORAGE_KEY = "user_destinations";

const categories = [
  { name: "Nature", icon: "🌿" },
  { name: "Beach", icon: "🏖️" },
  { name: "Historical", icon: "🏛️" },
  { name: "Wildlife", icon: "🐘" },
];

type Destination = {
  id: number;
  name: string;
  district: string;
  category: string;
  description: string;
  bestTime: string;
  entryFee: string;
};

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [userPlaces, setUserPlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user-added destinations
  const loadUserPlaces = useCallback(async () => {
    try {
      setLoading(true);

      const savedPlaces = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedPlaces) {
        setUserPlaces(JSON.parse(savedPlaces));
      } else {
        setUserPlaces([]);
      }
    } catch (error) {
      console.log("Error loading destinations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload data when Home screen becomes active
  useFocusEffect(
    useCallback(() => {
      loadUserPlaces();
    }, [loadUserPlaces]),
  );

  // Combine default and user-added destinations
  const allPlaces: Destination[] = [...places, ...userPlaces];

  // Search destinations
  const filteredPlaces = allPlaces.filter(
    (place) =>
      place.name.toLowerCase().includes(searchText.toLowerCase()) ||
      place.district.toLowerCase().includes(searchText.toLowerCase()) ||
      place.category.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Featured destinations
  const featuredPlaces = allPlaces.slice(0, 3);

  // Navigate to destination details
  const openDetails = (id: number) => {
    router.push({
      pathname: "/place/[id]",
      params: { id: String(id) },
    });
  };

  // Navigate to Explore with selected category
  const openCategory = (categoryName: string) => {
    router.push({
      pathname: "/(tabs)/explore",
      params: { category: categoryName },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ExploreLanka 🇱🇰</Text>
          <Text style={styles.headerSubtitle}>
            Discover the beauty of Sri Lanka
          </Text>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Hello, Explorer! 👋</Text>

          <Text style={styles.description}>
            Discover amazing places, beautiful beaches, mountains and
            unforgettable experiences around Sri Lanka.
          </Text>

          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            placeholderTextColor="#999999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Destination Count */}
        <View style={styles.statsCard}>
          <View>
            <Text style={styles.statsNumber}>
              {loading ? "..." : allPlaces.length}
            </Text>
            <Text style={styles.statsLabel}>Destinations to Explore</Text>
          </View>

          <Text style={styles.statsIcon}>🗺️</Text>
        </View>

        {/* Popular Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>

          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <Pressable
                key={category.name}
                style={styles.categoryCard}
                onPress={() => openCategory(category.name)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>

                <Text style={styles.categoryName}>{category.name}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Search Results */}
        {searchText.trim().length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({filteredPlaces.length})
            </Text>

            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <Pressable
                  key={place.id}
                  style={styles.card}
                  onPress={() => openDetails(place.id)}
                >
                  <Text style={styles.placeName}>{place.name}</Text>

                  <Text style={styles.placeLocation}>
                    {place.district} District
                  </Text>

                  <Text style={styles.placeCategory}>{place.category}</Text>

                  <Text style={styles.viewDetails}>View Details →</Text>
                </Pressable>
              ))
            ) : (
              <Text style={styles.noResults}>No destinations found.</Text>
            )}
          </View>
        ) : (
          <>
            {/* Featured Destinations */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Featured Destinations ⭐
                </Text>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#087F70" />
              ) : (
                featuredPlaces.map((place) => (
                  <Pressable
                    key={place.id}
                    style={styles.card}
                    onPress={() => openDetails(place.id)}
                  >
                    <Text style={styles.placeName}>{place.name}</Text>

                    <Text style={styles.placeLocation}>
                      📍 {place.district} District
                    </Text>

                    <Text style={styles.placeCategory}>{place.category}</Text>

                    <Text style={styles.placeDescription}>
                      {place.description}
                    </Text>

                    <Text style={styles.viewDetails}>View Details →</Text>
                  </Pressable>
                ))
              )}
            </View>
          </>
        )}

        {/* Explore Button */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitle}>
            Ready for your next adventure?
          </Text>

          <Text style={styles.exploreDescription}>
            Find your perfect destination in Sri Lanka.
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => openCategory("All")}
          >
            <Text style={styles.exploreButtonText}>
              Explore All Destinations →
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#087F70",
    padding: 25,
    paddingTop: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "bold",
  },

  headerSubtitle: {
    color: "#E0F2EF",
    marginTop: 8,
    fontSize: 15,
  },

  welcome: {
    padding: 20,
  },

  welcomeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#172B4D",
  },

  description: {
    fontSize: 15,
    color: "#667085",
    marginTop: 10,
    lineHeight: 23,
  },

  searchInput: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },

  statsCard: {
    backgroundColor: "#E0F2EF",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsNumber: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#087F70",
  },

  statsLabel: {
    fontSize: 14,
    color: "#52616B",
    marginTop: 5,
  },

  statsIcon: {
    fontSize: 38,
  },

  section: {
    padding: 20,
  },

  sectionHeader: {
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#172B4D",
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },

  categoryCard: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },

  categoryName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#087F70",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#087F70",
  },

  placeLocation: {
    fontSize: 14,
    color: "#667085",
    marginTop: 8,
  },

  placeCategory: {
    fontSize: 14,
    color: "#333333",
    marginTop: 7,
  },

  placeDescription: {
    fontSize: 14,
    color: "#667085",
    marginTop: 8,
    lineHeight: 21,
  },

  viewDetails: {
    color: "#087F70",
    fontWeight: "bold",
    marginTop: 12,
  },

  noResults: {
    color: "#888888",
    fontSize: 15,
    textAlign: "center",
    marginTop: 20,
  },

  exploreSection: {
    backgroundColor: "#E0F2EF",
    margin: 20,
    marginTop: 0,
    padding: 22,
    borderRadius: 15,
    alignItems: "center",
  },

  exploreTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#172B4D",
    textAlign: "center",
  },

  exploreDescription: {
    fontSize: 14,
    color: "#667085",
    textAlign: "center",
    marginTop: 8,
  },

  exploreButton: {
    backgroundColor: "#087F70",
    padding: 15,
    borderRadius: 10,
    marginTop: 18,
    width: "100%",
    alignItems: "center",
  },

  exploreButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
