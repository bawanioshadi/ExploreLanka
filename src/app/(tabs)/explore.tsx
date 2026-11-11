import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import { places } from "../../data/places";
import { placeImages } from "../../data/place-images";

const STORAGE_KEY = "user_destinations";

const categories = ["All", "Nature", "Beach", "Historical", "Wildlife"];

type Destination = {
  id: number;
  name: string;
  district: string;
  category: string;
  description: string;
  bestTime: string;
  entryFee: string;
};

export default function ExploreScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();

  const initialCategory =
    typeof category === "string" && categories.includes(category)
      ? category
      : "All";
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [lastCategoryParam, setLastCategoryParam] = useState(category);
  const [userPlaces, setUserPlaces] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  if (category !== lastCategoryParam) {
    setLastCategoryParam(category);
    setSelectedCategory(initialCategory);
  }

  // Load user-added destinations
  const loadUserPlaces = useCallback(async () => {
    try {
      setLoading(true);

      const storedData = await AsyncStorage.getItem(STORAGE_KEY);

      if (storedData) {
        const parsedData: Destination[] = JSON.parse(storedData);
        setUserPlaces(parsedData);
      } else {
        setUserPlaces([]);
      }
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

  // Combine default and user-added destinations
  const allPlaces: Destination[] = [...places, ...userPlaces];

  // Search and category filtering
  const filteredPlaces = allPlaces.filter((place) => {
    const search = searchText.toLowerCase().trim();

    const matchesSearch =
      place.name.toLowerCase().includes(search) ||
      place.district.toLowerCase().includes(search);

    const matchesCategory =
      selectedCategory === "All" ||
      place.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Explore Sri Lanka 🇱🇰</Text>

      <Text style={styles.subtitle}>Find your next favourite destination.</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name or district..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <Text style={styles.sectionTitle}>Categories</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((item) => (
          <Pressable
            key={item}
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.selectedCategoryText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>
        {selectedCategory === "All"
          ? "All Destinations"
          : `${selectedCategory} Destinations`}{" "}
        ({filteredPlaces.length})
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#087F70" style={styles.loader} />
      ) : filteredPlaces.length > 0 ? (
        filteredPlaces.map((place) => (
          <Pressable
            key={place.id}
            style={styles.card}
            onPress={() => router.push(`/place/${place.id}`)}
          >
            {placeImages[place.name] ? (
              <Image
                source={placeImages[place.name]}
                style={styles.destinationImage}
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.district}>{place.district} District</Text>
            <Text style={styles.category}>{place.category}</Text>

            <Text style={styles.description} numberOfLines={2}>
              {place.description}
            </Text>

            <Text style={styles.viewDetails}>View Details →</Text>
          </Pressable>
        ))
      ) : (
        <Text style={styles.noResults}>No destinations found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#087F70",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 8,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263653",
    marginTop: 25,
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  selectedCategory: {
    backgroundColor: "#087F70",
    borderColor: "#087F70",
  },
  categoryText: {
    color: "#333333",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  destinationImage: {
    width: "100%",
    height: 170,
    borderRadius: 10,
    marginBottom: 12,
  },
  placeName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#087F70",
  },
  district: {
    fontSize: 16,
    color: "#666666",
    marginTop: 8,
  },
  category: {
    fontSize: 15,
    color: "#333333",
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: "#555555",
    marginTop: 8,
    lineHeight: 20,
  },
  loader: {
    marginTop: 30,
  },
  noResults: {
    textAlign: "center",
    color: "#888888",
    marginTop: 25,
    fontSize: 16,
  },
  viewDetails: {
    color: "#087F70",
    fontWeight: "bold",
    marginTop: 12,
  },
});
