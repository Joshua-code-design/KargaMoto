import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LocationScreen = () => {
  const [pickupDropdownVisible, setPickupDropdownVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState('Set pickup location');
  const [pickupType, setPickupType] = useState(null);
  const [destinationDropdownVisible, setDestinationDropdownVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Choose your destination');
  const navigation = useNavigation();
  const route = useRoute();

  // Update selectedPickup and selectedDestination when route.params changes
  useEffect(() => {
    if (route.params?.pickupAddress) {
      setSelectedPickup(route.params.pickupAddress);
    }
    if (route.params?.destinationAddress) {
      setSelectedDestination(route.params.destinationAddress);
    }
  }, [route.params]);

  const togglePickupDropdown = () => {
    setPickupDropdownVisible(!pickupDropdownVisible);
    if (destinationDropdownVisible) setDestinationDropdownVisible(false);
  };

  const toggleDestinationDropdown = () => {
    setDestinationDropdownVisible(!destinationDropdownVisible);
    if (pickupDropdownVisible) setPickupDropdownVisible(false);
  };

  const selectPickupOption = async (option, type) => {
    if (type === 'current') {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location permissions to use this feature.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address.length > 0) {
          const formattedAddress = `${address[0].name || ''}, ${address[0].city || ''}, ${address[0].region || ''}`;
          setSelectedPickup(formattedAddress);
        } else {
          setSelectedPickup('Unknown Location');
        }
      } catch (error) {
        Alert.alert('Location Error', 'Unable to get your current location.');
        setSelectedPickup('Unknown Location');
      }
    } else if (type === 'map') {
      navigation.navigate('Map', {
        onSelectLocation: (location, address) => {
          navigation.navigate('LocationScreen', {
            pickupAddress: address,
            destinationAddress: selectedDestination, // Preserve destination address
          });
        },
        isSelectingPickup: true,
        currentPickup: selectedPickup, // Pass current pickup address
        currentDestination: selectedDestination, // Pass current destination address
      });
    } else {
      setSelectedPickup(option);
    }

    setPickupType(type);
    setPickupDropdownVisible(false);
  };

  const selectDestinationOption = (option, type) => {
    if (type === 'map') {
      navigation.navigate('Map', {
        onSelectLocation: (location, address) => {
          navigation.navigate('LocationScreen', {
            destinationAddress: address,
            pickupAddress: selectedPickup, // Preserve pickup address
          });
        },
        isSelectingDestination: true,
        currentPickup: selectedPickup, // Pass current pickup address
        currentDestination: selectedDestination, // Pass current destination address
      });
    } else {
      setSelectedDestination(option);
      setDestinationDropdownVisible(false);
    }
  };

  const handleContinue = () => {
    // Navigate to the next screen or handle the selected locations
    if (selectedPickup === 'Set pickup location' || selectedDestination === 'Choose your destination') {
      Alert.alert('Missing Information', 'Please select both pickup and destination locations.');
      return;
    }
    
    // Navigate to next screen with the selected locations
    navigation.navigate('ConfirmRide', {
      pickup: selectedPickup,
      destination: selectedDestination
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f8f9fa', '#ffffff']}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <View style={styles.placeholder} />
        </View>
        
        {/* Main content */}
        <View style={styles.content}>
          <View style={styles.mapPreview}>
            <Image 
              source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=0,0&zoom=3&size=600x300&key=YOUR_API_KEY' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <Text style={styles.mapText}>Where are you going today?</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <View style={styles.locationIconContainer}>
                <View style={styles.pickupDot} />
                <View style={styles.locationLine} />
                <View style={styles.destinationDot} />
              </View>
              
              <View style={styles.inputsWrapper}>
                <View>
                  <TouchableOpacity
                    style={[styles.input, pickupDropdownVisible && styles.inputActive]}
                    activeOpacity={0.7}
                    onPress={togglePickupDropdown}
                  >
                    <Text style={styles.inputLabel}>PICKUP</Text>
                    <Text style={styles.inputText} numberOfLines={1}>
                      {selectedPickup}
                    </Text>
                    <Ionicons
                      name={pickupDropdownVisible ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {pickupDropdownVisible && (
                    <View style={styles.dropdownContainer}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectPickupOption('Use current location', 'current')}
                      >
                        <Ionicons name="locate-outline" size={20} color="#2196F3" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Use current location</Text>
                          <Text style={styles.dropdownItemSubtext}>Fastest option</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectPickupOption('Search for a place', 'search')}
                      >
                        <Ionicons name="search-outline" size={20} color="#4CAF50" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Search for a place</Text>
                          <Text style={styles.dropdownItemSubtext}>Address, landmark, business</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectPickupOption('Pick from map', 'map')}
                      >
                        <Ionicons name="map-outline" size={20} color="#FF9800" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Pick from map</Text>
                          <Text style={styles.dropdownItemSubtext}>Select a point on the map</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                
                <View>
                  <TouchableOpacity
                    style={[styles.input, destinationDropdownVisible && styles.inputActive]}
                    activeOpacity={0.7}
                    onPress={toggleDestinationDropdown}
                  >
                    <Text style={styles.inputLabel}>DESTINATION</Text>
                    <Text style={styles.inputText} numberOfLines={1}>
                      {selectedDestination}
                    </Text>
                    <Ionicons
                      name={destinationDropdownVisible ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>
                  {destinationDropdownVisible && (
                    <View style={styles.dropdownContainer}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectDestinationOption('Search for a place', 'search')}
                      >
                        <Ionicons name="search-outline" size={20} color="#4CAF50" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Search for a place</Text>
                          <Text style={styles.dropdownItemSubtext}>Address, landmark, business</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectDestinationOption('Pick from map', 'map')}
                      >
                        <Ionicons name="map-outline" size={20} color="#FF9800" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Pick from map</Text>
                          <Text style={styles.dropdownItemSubtext}>Select a point on the map</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
            
            <View style={styles.recentLocations}>
              <Text style={styles.recentTitle}>Recent Locations</Text>
              <TouchableOpacity 
                style={styles.recentItem}
                onPress={() => selectDestinationOption('Home - 123 Main St', 'saved')}
              >
                <Ionicons name="home-outline" size={20} color="#333" />
                <View style={styles.recentTextContainer}>
                  <Text style={styles.recentItemText}>Home</Text>
                  <Text style={styles.recentItemSubtext}>123 Main St</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.recentItem}
                onPress={() => selectDestinationOption('Work - 456 Office Park', 'saved')}
              >
                <Ionicons name="briefcase-outline" size={20} color="#333" />
                <View style={styles.recentTextContainer}>
                  <Text style={styles.recentItemText}>Work</Text>
                  <Text style={styles.recentItemSubtext}>456 Office Park</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Footer with continue button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.continueButton} 
            activeOpacity={0.8}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  mapPreview: {
    height: height * 0.25,
    width: '100%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: height * 0.03,
  },
  locationIconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 20,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2196F3',
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  inputsWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: height * 0.018,
    borderRadius: 10,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  inputLabel: {
    fontSize: width * 0.03,
    color: '#999',
    marginBottom: 4,
    fontWeight: '500',
  },
  inputText: {
    color: '#333',
    fontSize: width * 0.04,
    fontWeight: '500',
    marginRight: 20,
  },
  dropdownContainer: {
    backgroundColor: '#f9f9f9',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: height * 0.015,
    borderWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  dropdownItemText: {
    color: '#333',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    color: '#777',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  recentLocations: {
    marginTop: height * 0.01,
  },
  recentTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.015,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  recentItemText: {
    color: '#333',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  recentItemSubtext: {
    color: '#777',
    fontSize: width * 0.03,
    marginTop: 2,
  },
  footer: {
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: height * 0.018,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginRight: 10,
  }
});

export default LocationScreen;