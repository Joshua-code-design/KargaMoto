import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Circle } from 'react-native-maps';

const RiderSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bacolod City coordinates
  const BACOLOD_REGION = {
    latitude: 10.6713,
    longitude: 122.9511,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };
  
  // Sample data for nearby riders with coordinates in Bacolod
  const nearbyRiders = [
    {
      id: '1',
      name: 'Fernando Poputi',
      description: 'Accommodation',
      distance: '0.8 km',
      eta: '3 minutes',
      avatar: require('../../assets/kms.png'),
      coordinate: {
        latitude: 10.6680,
        longitude: 122.9530,
      },
    },
    {
      id: '2',
      name: 'Reynando Malupiton',
      description: 'Accommodation',
      distance: '1.2 km',
      eta: '5 minutes',
      avatar: require('../../assets/kms.png'),
      coordinate: {
        latitude: 10.6780,
        longitude: 122.9490,
      },
    },
    {
      id: '3',
      name: 'Donato Aguinaldo',
      description: 'Accommodation',
      distance: '1.8 km',
      eta: '7 minutes',
      avatar: require('../../assets/kms.png'),
      coordinate: {
        latitude: 10.6650,
        longitude: 122.9570,
      },
    },
    {
      id: '4',
      name: 'Rolando Jojo',
      description: 'Accommodation',
      distance: '2.4 km',
      eta: '9 minutes',
      avatar: require('../../assets/kms.png'),
      coordinate: {
        latitude: 10.6800,
        longitude: 122.9430,
      },
    },
    {
      id: '5',
      name: 'Marelyn Milan',
      description: 'Accommodation',
      distance: '2.9 km',
      eta: '11 minutes',
      avatar: require('../../assets/kms.png'),
      coordinate: {
        latitude: 10.6600,
        longitude: 122.9450,
      },
    },
  ];
  
  // User's current location (centered in Bacolod City)
  const userLocation = {
    latitude: 10.6713,
    longitude: 122.9511,
  };

  const renderRiderItem = ({ item }) => (
    <TouchableOpacity style={styles.riderItem}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.riderInfo}>
        <Text style={styles.riderName}>{item.name}</Text>
        <Text style={styles.riderDescription}>
          {item.description} • <Text style={styles.distanceText}>{item.distance}</Text> • {item.eta}
        </Text>
      </View>
      <TouchableOpacity style={styles.chatButton}>
        <Text style={styles.chatButtonText}>Choice</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={BACOLOD_REGION}
          provider="google"
        >
          {/* User location marker */}
          <Marker
            coordinate={userLocation}
            title="Your Location"
            description="You are here"
          >
            <View style={styles.userMarker}>
              <View style={styles.userMarkerInner} />
            </View>
          </Marker>
          
          {/* Distance circle */}
          <Circle
            center={userLocation}
            radius={1000}
            strokeWidth={1}
            strokeColor="rgba(65, 105, 225, 0.3)"
            fillColor="rgba(65, 105, 225, 0.1)"
          />
          
          {/* Rider markers */}
          {nearbyRiders.map((rider) => (
            <Marker
              key={rider.id}
              coordinate={rider.coordinate}
              title={rider.name}
              description={`${rider.distance} • ${rider.eta}`}
            >
              <View style={styles.riderMarker}>
                <MaterialIcons name="directions-bike" size={16} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Searching for Rider..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Riders List */}
      <View style={styles.ridersContainer}>
        <Text style={styles.ridersTitle}>Riders near you in Bacolod City</Text>
        <FlatList
          data={nearbyRiders}
          renderItem={renderRiderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    height: '50%',
    position: 'relative',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginLeft: 8,
  },
  cancelText: {
    color: '#007bff',
    fontSize: 16,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(65, 105, 225, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(65, 105, 225, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgb(65, 105, 225)',
  },
  riderMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF4D94',
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ridersContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  ridersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  riderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
  },
  riderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  riderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  riderDescription: {
    fontSize: 14,
    color: '#666',
  },
  distanceText: {
    fontWeight: '500',
    color: '#FF4D94',
  },
  chatButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RiderSearchScreen;