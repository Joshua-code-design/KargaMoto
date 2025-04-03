import React from 'react';
import { 
  View, 
  SafeAreaView, 
  StyleSheet, 
  Platform, 
  Dimensions, 
  StatusBar,
  TouchableOpacity,
  Text
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchPlaceScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { isPickup, currentPickup, currentDestination } = route.params;
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth > 768;

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

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isPickup ? 'Select Pickup Location' : 'Select Destination'}
          </Text>
        </View>
        
        <View style={[styles.searchContainer, isTablet && styles.tabletSearchContainer]}>
          <GooglePlacesAutocomplete
            placeholder={`Search for a ${isPickup ? 'pickup' : 'destination'} in Bacolod City`}
            onPress={handlePlaceSelect}
            query={{
              key: 'AIzaSyBezmbkcpuSIpDOrFtMkGfsU3u_ZDf7xlg', // Replace with your Google API Key
              language: 'en',
              components: 'country:PH', // Restrict to the Philippines
              location: '10.6765,122.9509', // Bacolod City's lat & lng
              radius: 25000, // 25km radius around Bacolod
              strictbounds: true, // Enforce results within bounds
            }}
            fetchDetails={true} // Ensure details are fetched
            enablePoweredByContainer={false}
            debounce={300}
            minLength={2}
            renderDescription={row => row.description}
            styles={{
              container: {
                flex: 0,
              },
              textInputContainer: {
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRadius: 8,
                paddingHorizontal: 0,
              },
              textInput: {
                height: 50,
                color: '#333',
                fontSize: 16,
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginTop: 0,
                marginBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                paddingTop: 0,
                paddingBottom: 0,
              },
              listView: {
                backgroundColor: '#fff',
                borderRadius: 12,
                marginTop: 10,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                borderWidth: Platform.OS === 'ios' ? 1 : 0,
                borderColor: Platform.OS === 'ios' ? '#eee' : 'transparent',
              },
              row: {
                backgroundColor: '#fff',
                paddingVertical: 15,
                paddingHorizontal: 16,
              },
              separator: {
                height: 1,
                backgroundColor: '#f0f0f0',
                marginLeft: 16,
              },
              description: {
                fontSize: 15,
                color: '#333',
              },
              predefinedPlacesDescription: {
                color: '#1a73e8',
              },
            }}
          />
        </View>
        
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          {/* You could add a FlatList here to show recent searches */}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 22,
    color: '#333',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    zIndex: 1,
  },
  tabletSearchContainer: {
    paddingHorizontal: '15%', // Wider padding on tablets
  },
  recentSearchesContainer: {
    flex: 1,
    padding: 16,
    zIndex: 0,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
});

export default SearchPlaceScreen;