import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY = Constants.expoConfig.extra.googleApiKey;
//const GOOGLE_MAPS_API_KEY = 'AIzaSyBezmbkcpuSIpDOrFtMkGfsU3u_ZDf7xlg';

const Map = ({ route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Enable location permissions in Settings.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    })();
  }, []);

  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("No Location Selected", "Please select a location before confirming.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.latitude},${selectedLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      //to move in backend for security reasons
      const data = await response.json();
  
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0].formatted_address;
  
        if (route.params?.isSelectingPickup) {
          navigation.navigate("RideScreen", {
            pickupAddress: address,
            destinationAddress: route.params.currentDestination,
            serviceType: route.params?.serviceType,
          });
        } else if (route.params?.isSelectingDestination) {
          navigation.navigate("RideScreen", {
            destinationAddress: address,
            pickupAddress: route.params.currentPickup,
            serviceType: route.params?.serviceType,
          });
        } else if (route.params?.isSelectingAddress) {
          navigation.navigate("FavScreen", {
            selectedLocation: {
              address, // Pass the formatted address
              latitude: selectedLocation.latitude, // Pass latitude
              longitude: selectedLocation.longitude, // Pass longitude
            },
          });
        }
      } else {
        Alert.alert("Error", "Unable to fetch address. Try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch address. Try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        onPress={handleSelectLocation}
        region={currentLocation}
        showsUserLocation={true}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
        {currentLocation && (
          <Circle
            center={currentLocation}
            radius={50}
            strokeColor="rgba(0, 112, 255, 0.5)"
            fillColor="rgba(0, 112, 255, 0.3)"
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmLocation}
        disabled={!selectedLocation}
      >
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.25,
    right: width * 0.25,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Map;