
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

import { useState } from 'react';import { SafeAreaView } from 'react-native-safe-area-context';
import {places} from '../data/places';

export default function HomeScreen() {

  const [searchText, setSearchText] = useState('');

const filteredPlaces = places.filter((place) =>
  place.name.toLowerCase().includes(searchText.toLowerCase()) ||
  place.district.toLowerCase().includes(searchText.toLowerCase()) ||
  place.category.toLowerCase().includes(searchText.toLowerCase())
);
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView>

        {/* App Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>ExploreLanka</Text>
          <Text style={styles.subtitle}>
            Discover the beauty of Sri Lanka 🇱🇰
          </Text>
        </View>

        {/* Welcome Section */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>
          Explore New Places
        </Text>

        <Text style={styles.description}>
          Find beautiful destinations around Sri Lanka.
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {filteredPlaces.map((place) => (

        
        
  <View key={place.id} style={styles.card}>
    <Text style={styles.placeName}>
      {place.name}
    </Text>

    <Text style={styles.placeLocation}>
      {place.district} District
    </Text>

    <Text>
      {place.category}
    </Text>
  </View>
))}

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  searchInput: {
  backgroundColor: '#FFFFFF',
  padding: 15,
  borderRadius: 10,
  marginTop: 20,
  fontSize: 15,
  borderWidth: 1,
  borderColor: '#DDDDDD',
},

noResults: {
  color: '#888888',
  fontSize: 15,
  textAlign: 'center',
  marginTop: 20,
},
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },

  header: {
    backgroundColor: '#087E70',
    padding: 25,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#FFFFFF',
    marginTop: 8,
    fontSize: 14,
  },

  welcome: {
    padding: 20,
  },

  welcomeTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  description: {
    fontSize: 15,
    color: '#667085',
    marginTop: 8,
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#172B4D',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },

  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#087E70',
  },

  placeLocation: {
    fontSize: 14,
    color: '#667085',
    marginTop: 5,
  },
});
