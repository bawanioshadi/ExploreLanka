import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { places } from "../../data/places";

const categories = ["All", "Nature", "Beach", "Historical", "Wildlife"];

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchText.toLowerCase()) ||
      place.district.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView style={styles.container}>
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
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>
        Destinations ({filteredPlaces.length})
      </Text>

      {filteredPlaces.length > 0 ? (
        filteredPlaces.map((place) => (
          <Pressable
            key={place.id}
            style={styles.card}
            onPress={() => router.push(`/place/${place.id}`)}
          >
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.district}>{place.district} District</Text>
            <Text style={styles.category}>{place.category}</Text>
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
    padding: 20,
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
