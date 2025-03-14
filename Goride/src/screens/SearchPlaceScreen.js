import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, useRoute } from '@react-navigation/native';

const SearchPlaceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isPickup, currentPickup, currentDestination } = route.params;

  const handlePlaceSelect = (data, details = null) => {
    const address = details.formatted_address;
    const latitude = details.geometry.location.lat;
    const longitude = details.geometry.location.lng;

    // Pass the selected place back to the previous screen
    navigation.navigate('RideScreen', {
      [isPickup ? 'pickupAddress' : 'destinationAddress']: address,
      [isPickup ? 'pickupLatitude' : 'destinationLatitude']: latitude,
      [isPickup ? 'pickupLongitude' : 'destinationLongitude']: longitude,
      currentPickup: isPickup ? address : currentPickup, // Preserve existing pickup
      currentDestination: isPickup ? currentDestination : address, // Preserve existing destination
      serviceType: route.params?.serviceType, 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={handlePlaceSelect}
        query={{
          key: 'AIzaSyBezmbkcpuSIpDOrFtMkGfsU3u_ZDf7xlg', // Replace with your Google Places API key
          language: 'en',
        }}
        fetchDetails={true} // Ensure details are fetched
        styles={{
          textInputContainer: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            height: 40,
            color: '#111',
            fontSize: 16,
          },
          listView: {
            backgroundColor: '#fff',
            borderRadius: 8,
            marginTop: 10,
            elevation: 5,
          },
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});

export default SearchPlaceScreen;