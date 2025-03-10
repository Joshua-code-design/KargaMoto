import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const Map = ({ route }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSelectingDestination, setIsSelectingDestination] = useState(false); // New state for destination selection
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Enable location permissions to use this feature.");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);
    })();
  }, []);

  // Handle selecting a location on the map
  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  // Handle confirming the selected location
  const handleConfirmLocation = async () => {
    if (!selectedLocation) {
      Alert.alert("No Location Selected", "Please select a location before confirming.");
      return;
    }

    try {
      let addressResponse = await Location.reverseGeocodeAsync(selectedLocation);
      let address = addressResponse[0]
        ? `${addressResponse[0].name || "Unknown"}, ${addressResponse[0].city || "Unknown"}, ${addressResponse[0].region || "Unknown"}`
        : "Address not found";

      // Check if the user is selecting a destination
      if (isSelectingDestination) {
        // Pass the selected destination address back to LocationModal
        navigation.navigate("LocationModal", { selectedDestination: address });
      } else {
        // Pass selected location and address back to LocationModal for pickup
        navigation.navigate("LocationModal", { selectedLocation, address });
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch address. Try again.");
    }
  };

  // Set the mode to destination selection when the component is used for selecting a destination
  useEffect(() => {
    if (route.params?.isSelectingDestination) {
      setIsSelectingDestination(true);
    }
  }, [route.params]);

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
        <Text style={styles.confirmButtonText}>
          {isSelectingDestination ? "Set Destination" : "Confirm Pickup"}
        </Text>
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