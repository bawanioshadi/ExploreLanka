import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

const STORAGE_KEY = "user_destinations";

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
      setCategory("");
      setDescription("");
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
      <Text style={styles.title}>Add New Destination</Text>

      <Text style={styles.subtitle}>Share a beautiful place in Sri Lanka.</Text>

      <Text style={styles.label}>Place Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter place name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>District *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter district"
        value={district}
        onChangeText={setDistrict}
      />

      <Text style={styles.label}>Category *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nature / Beach / Historical / Wildlife"
        value={category}
        onChangeText={setCategory}
      />

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
      >
        <Text style={styles.buttonText}>
          {isSaving ? "Saving..." : "Save Destination"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F7",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#087F70",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 25,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    color: "#222222",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#087F70",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
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
