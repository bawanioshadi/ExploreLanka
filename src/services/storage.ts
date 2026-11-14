import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Destination } from "../types/destination";

// Storage Keys
const USER_DESTINATIONS_KEY = "user_destinations";
const FAVORITES_KEY = "favoritePlaces";

// ----------------------------------
// USER DESTINATIONS
// ----------------------------------

// Get all user-added destinations
export const getUserDestinations = async (): Promise<Destination[]> => {
  try {
    const storedData = await AsyncStorage.getItem(USER_DESTINATIONS_KEY);

    if (!storedData) return [];

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) return [];

    return parsedData as Destination[];
  } catch (error) {
    console.error("Error loading destinations:", error);
    return [];
  }
};

// Save user destinations
export const saveUserDestinations = async (
  destinations: Destination[],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      USER_DESTINATIONS_KEY,
      JSON.stringify(destinations),
    );
  } catch (error) {
    console.error("Error saving destinations:", error);
    throw error;
  }
};

// Add a new destination
export const addUserDestination = async (
  destination: Destination,
): Promise<void> => {
  const existingDestinations = await getUserDestinations();

  const alreadyExists = existingDestinations.some(
    (place) => place.id === destination.id,
  );

  if (alreadyExists) {
    throw new Error("Destination already exists.");
  }

  await saveUserDestinations([...existingDestinations, destination]);
};

// Update an existing destination
export const updateUserDestination = async (
  updatedDestination: Destination,
): Promise<void> => {
  const destinations = await getUserDestinations();

  const updatedPlaces = destinations.map((place) =>
    place.id === updatedDestination.id ? updatedDestination : place,
  );

  await saveUserDestinations(updatedPlaces);
};

// Delete a user-added destination
export const deleteUserDestination = async (
  destinationId: number,
): Promise<void> => {
  const destinations = await getUserDestinations();

  const updatedPlaces = destinations.filter(
    (place) => place.id !== destinationId,
  );

  await saveUserDestinations(updatedPlaces);

  // Also remove it from favorites
  await removeFavorite(destinationId);
};

// ----------------------------------
// FAVORITES
// ----------------------------------

// Get favorite destination IDs
export const getFavoriteIds = async (): Promise<number[]> => {
  try {
    const storedData = await AsyncStorage.getItem(FAVORITES_KEY);

    if (!storedData) return [];

    const parsedData: unknown = JSON.parse(storedData);

    if (!Array.isArray(parsedData)) return [];

    return parsedData.filter((id): id is number => typeof id === "number");
  } catch (error) {
    console.error("Error loading favorite IDs:", error);
    return [];
  }
};

// Save favorite destination IDs
export const saveFavoriteIds = async (favoriteIds: number[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  } catch (error) {
    console.error("Error saving favorites:", error);
    throw error;
  }
};

// Add a destination to favorites
export const addFavorite = async (destinationId: number): Promise<void> => {
  const favoriteIds = await getFavoriteIds();

  if (favoriteIds.includes(destinationId)) return;

  await saveFavoriteIds([...favoriteIds, destinationId]);
};

// Remove a destination from favorites
export const removeFavorite = async (destinationId: number): Promise<void> => {
  const favoriteIds = await getFavoriteIds();

  const updatedIds = favoriteIds.filter((id) => id !== destinationId);

  await saveFavoriteIds(updatedIds);
};

// Check whether a destination is a favorite
export const isFavorite = async (destinationId: number): Promise<boolean> => {
  const favoriteIds = await getFavoriteIds();

  return favoriteIds.includes(destinationId);
};
