import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { places } from "../../data/places";
import {
  getFavoriteIds,
  getProfileName,
  getUserDestinations,
  saveProfileName,
} from "../../services/storage";

const COLORS = {
  forest: "#183F35",
  green: "#245C4A",
  gold: "#C9A85D",
  ivory: "#F8F6EF",
  white: "#FFFFFF",
  text: "#263B34",
  muted: "#87918B",
  border: "#E8E5DA",
};

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(true);

  const [profileName, setProfileName] = useState("Travel Explorer");
  const [editedName, setEditedName] = useState("");
  const [isEditVisible, setIsEditVisible] = useState(false);

  const [destinationCount, setDestinationCount] = useState(places.length);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load real profile and destination data
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfileData = async () => {
        try {
          const [name, favorites, userDestinations] = await Promise.all([
            getProfileName(),
            getFavoriteIds(),
            getUserDestinations(),
          ]);

          if (!isActive) return;

          setProfileName(name);
          setSavedCount(favorites.length);
          setDestinationCount(places.length + userDestinations.length);
        } catch (error) {
          console.error("Error loading profile data:", error);
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      loadProfileData();

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Generate initials from profile name
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);

    if (words.length === 0 || !words[0]) return "TR";

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // Open Edit Profile modal
  const openEditProfile = () => {
    setEditedName(profileName);
    setIsEditVisible(true);
  };

  // Save updated profile name
  const handleSaveProfile = async () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      Alert.alert("Invalid Name", "Please enter your name.");
      return;
    }

    try {
      await saveProfileName(trimmedName);
      setProfileName(trimmedName);
      setIsEditVisible(false);

      Alert.alert("Success", "Your profile has been updated.");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Could not save your profile. Please try again.");
    }
  };

  const showMessage = (title: string) => {
    Alert.alert(title, "This feature will be available in a future update.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
            <Text style={styles.title}>My Profile</Text>
          </View>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => showMessage("Settings")}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(profileName)}</Text>
          </View>

          <Text style={styles.profileName}>{profileName}</Text>

          <Text style={styles.profileEmail}>Welcome to ExploreLanka</Text>

          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>✦ ISLAND EXPLORER</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={openEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* REAL STATISTICS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📍</Text>

            {loading ? (
              <ActivityIndicator color={COLORS.forest} />
            ) : (
              <Text style={styles.statNumber}>{destinationCount}</Text>
            )}

            <Text style={styles.statLabel}>Destinations</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>♡</Text>

            {loading ? (
              <ActivityIndicator color={COLORS.forest} />
            ) : (
              <Text style={styles.statNumber}>{savedCount}</Text>
            )}

            <Text style={styles.statLabel}>Saved Places</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🧭</Text>
            <Text style={styles.statNumber}>--</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
        </View>

        {/* PREFERENCES */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconBox}>
              <Text style={styles.settingIcon}>🔔</Text>
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive travel updates
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#D8DDD8",
                true: COLORS.green,
              }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIconBox}>
              <Text style={styles.settingIcon}>🌙</Text>
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Change app appearance
              </Text>
            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: "#D8DDD8",
                true: COLORS.green,
              }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIconBox}>
              <Text style={styles.settingIcon}>📶</Text>
            </View>

            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Offline Mode</Text>
              <Text style={styles.settingDescription}>
                Keep travel information available offline
              </Text>
            </View>

            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{
                false: "#D8DDD8",
                true: COLORS.green,
              }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* MORE */}
        <Text style={styles.sectionTitle}>More</Text>

        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => showMessage("About ExploreLanka")}
          >
            <Text style={styles.menuIcon}>🌴</Text>
            <Text style={styles.menuTitle}>About ExploreLanka</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => showMessage("Help & Support")}
          >
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuTitle}>Help & Support</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => showMessage("Privacy Policy")}
          >
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuTitle}>Privacy Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerBrand}>ExploreLanka</Text>
        <Text style={styles.footerText}>YOUR OFFLINE TRAVEL COMPANION</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={isEditVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.modalDescription}>Enter your display name</Text>

            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Your name"
              placeholderTextColor={COLORS.muted}
              maxLength={40}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.ivory,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  eyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.forest,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIcon: {
    fontSize: 23,
    color: COLORS.forest,
  },
  profileCard: {
    backgroundColor: COLORS.forest,
    borderRadius: 24,
    padding: 25,
    alignItems: "center",
    marginBottom: 18,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#E9D9A9",
    marginBottom: 14,
  },
  avatarText: {
    color: COLORS.forest,
    fontSize: 26,
    fontWeight: "900",
  },
  profileName: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "800",
  },
  profileEmail: {
    color: "#C9D8D0",
    fontSize: 13,
    marginTop: 5,
  },
  memberBadge: {
    backgroundColor: "rgba(201,168,93,0.18)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 16,
  },
  memberBadgeText: {
    color: "#E7CC8A",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  editButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 11,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 19,
  },
  editButtonText: {
    color: COLORS.forest,
    fontSize: 13,
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statNumber: {
    color: COLORS.forest,
    fontSize: 21,
    fontWeight: "900",
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
  },
  sectionTitle: {
    color: COLORS.forest,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 13,
  },
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    gap: 12,
  },
  settingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.ivory,
    alignItems: "center",
    justifyContent: "center",
  },
  settingIcon: {
    fontSize: 19,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  settingDescription: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 17,
    gap: 13,
  },
  menuIcon: {
    fontSize: 19,
    width: 27,
  },
  menuTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  arrow: {
    color: COLORS.muted,
    fontSize: 25,
  },
  footerBrand: {
    color: COLORS.forest,
    textAlign: "center",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 5,
  },
  footerText: {
    color: COLORS.muted,
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 5,
  },
  version: {
    color: COLORS.muted,
    textAlign: "center",
    fontSize: 10,
    marginTop: 10,
  },

  // Edit Profile Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: COLORS.ivory,
    borderRadius: 22,
    padding: 24,
  },
  modalTitle: {
    color: COLORS.forest,
    fontSize: 23,
    fontWeight: "900",
  },
  modalDescription: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 7,
    marginBottom: 18,
  },
  nameInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 22,
  },
  cancelButton: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E9E7DF",
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "700",
  },
  saveButton: {
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.forest,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
