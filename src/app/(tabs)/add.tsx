import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { DestinationImage } from "../../components/destination-image";

const STORAGE_KEY = "user_destinations";
const categories = ["Nature", "Beach", "Historical", "Wildlife"];

export default function AddPlaceScreen() {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [bestTime, setBestTime] = useState("");
  const [entryFee, setEntryFee] = useState("");

  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setMessage("");

    // Validate required fields
    if (
      !name.trim() ||
      !district.trim() ||
      !category.trim() ||
      !description.trim()
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setIsSaving(true);

      // Get existing destinations
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);

      const existingPlaces = storedData ? JSON.parse(storedData) : [];

      // Create a new destination
      const newPlace = {
        id: Date.now(),
        name: name.trim(),
        district: district.trim(),
        category: category.trim(),
        description: description.trim(),
        bestTime: bestTime.trim() || "Not specified",
        entryFee: entryFee.trim() || "Not specified",
      };

      // Add new destination to existing list
      const updatedPlaces = [...existingPlaces, newPlace];

      // Save to local storage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));

      setMessage("Destination saved successfully!");

      // Clear form
      setName("");
      setDistrict("");
      setDescription("");
      setCategory("");
      setBestTime("");
      setEntryFee("");
    } catch (error) {
      console.error("Save destination error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.page}>
        <View style={styles.hero}>
          <DestinationImage name="Mirissa" style={styles.heroImage} />
          <View style={styles.heroShade} />
          <View style={styles.heroCopy}>
            <Text style={styles.eyebrow}>GROW THE GUIDE</Text>
            <Text style={styles.heroTitle}>Share a place you love</Text>
            <Text style={styles.heroSubtitle}>
              Help other travellers discover Sri Lanka.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.title}>New destination</Text>
          <Text style={styles.subtitle}>Add the details travellers need.</Text>

          <Text style={styles.label}>Place Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter place name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Text style={styles.label}>District *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter district"
            value={district}
            onChangeText={setDistrict}
            autoCapitalize="words"
          />

      <Text style={styles.label}>Category *</Text>
      <View style={styles.categoryList}>
        {categories.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: category === item }}
            onPress={() => setCategory(item)}
            style={[
              styles.categoryChip,
              category === item && styles.categoryChipSelected,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                category === item && styles.categoryChipTextSelected,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe this destination"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Best Time to Visit</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: December - April"
        value={bestTime}
        onChangeText={setBestTime}
      />

      <Text style={styles.label}>Entry Fee</Text>
      <TextInput
        style={styles.input}
        placeholder="Example: Rs. 500"
        value={entryFee}
        onChangeText={setEntryFee}
      />

      {message !== "" && (
        <Text
          style={[
            styles.message,
            message.includes("successfully")
              ? styles.successMessage
              : styles.errorMessage,
          ]}
        >
          {message}
        </Text>
      )}

      <Pressable
        style={[styles.button, isSaving && styles.disabledButton]}
        onPress={handleSave}
        disabled={isSaving}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>
          {isSaving ? "Saving..." : "Save Destination"}
        </Text>
      </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F7",
  },
  content: {
    alignItems: "center",
    padding: 18,
    paddingBottom: 36,
  },
  page: {
    width: "100%",
    maxWidth: 780,
    alignItems: "center",
  },
  hero: {
    width: "100%",
    height: 205,
    marginBottom: 16,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#164B43",
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
  },
  heroShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(8, 42, 37, 0.5)",
  },
  heroCopy: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  eyebrow: {
    color: "#D2ECE3",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 7,
  },
  heroSubtitle: {
    color: "#EDF7F3",
    fontSize: 14,
    marginTop: 5,
  },
  formCard: {
    width: "100%",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5ECE9",
    shadowColor: "#153C35",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  title: {
    fontSize: 23,
    fontWeight: "800",
    color: "#183A34",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#71817D",
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#30443F",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F9FBFA",
    borderWidth: 1,
    borderColor: "#DCE6E2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222222",
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DCE6E2",
    backgroundColor: "#F8FBF9",
  },
  categoryChipSelected: {
    backgroundColor: "#087F70",
    borderColor: "#087F70",
  },
  categoryChipText: {
    color: "#526660",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryChipTextSelected: {
    color: "#FFFFFF",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#087F70",
    padding: 16,
    borderRadius: 13,
    alignItems: "center",
    marginTop: 23,
    shadowColor: "#087F70",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 18,
    textAlign: "center",
  },
  successMessage: {
    color: "#087F40",
  },
  errorMessage: {
    color: "#D32F2F",
  },
});
