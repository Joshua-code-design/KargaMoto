import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { requestRide } from '../services/MapsApi';
import { geocodeAddress, reverseGeocodeCoordinates } from '../services/Geocoding'; // Import the new functions
import styles from '../styles/riderScreen';

const { width, height } = Dimensions.get('window');

const LocationScreen = () => {
  const [pickupDropdownVisible, setPickupDropdownVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState('Set pickup location');
  const [pickupType, setPickupType] = useState(null);
  const [destinationDropdownVisible, setDestinationDropdownVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Choose your destination');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const mapSlideAnim = useRef(new Animated.Value(-50)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pickupDotAnim = useRef(new Animated.Value(0.8)).current;
  const destinationDotAnim = useRef(new Animated.Value(0.8)).current;

  // Update selectedPickup and selectedDestination when route.params changes
  useEffect(() => {
    if (route.params?.pickupAddress) {
      setSelectedPickup(route.params.pickupAddress);
    }
    if (route.params?.destinationAddress) {
      setSelectedDestination(route.params.destinationAddress);
    }
  }, [route.params]);

  // Initial animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(mapSlideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 900,
        delay: 200,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 800,
        delay: 600,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulsing animation for dots
    startDotPulseAnimation();
  }, []);

  // Pulsing animation for location dots
  const startDotPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Run animation when pickup dot is selected
  const animatePickupDot = () => {
    Animated.sequence([
      Animated.timing(pickupDotAnim, {
        toValue: 1.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pickupDotAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Run animation when destination dot is selected
  const animateDestinationDot = () => {
    Animated.sequence([
      Animated.timing(destinationDotAnim, {
        toValue: 1.3,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(destinationDotAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigationTo = (screen) => {
    navigation.navigate(screen);
     };

  const togglePickupDropdown = () => {
    animatePickupDot();
    setPickupDropdownVisible(!pickupDropdownVisible);
    if (destinationDropdownVisible) setDestinationDropdownVisible(false);
  };

  const toggleDestinationDropdown = () => {
    animateDestinationDot();
    setDestinationDropdownVisible(!destinationDropdownVisible);
    if (pickupDropdownVisible) setPickupDropdownVisible(false);
  };

  const selectPickupOption = async (option, type) => {
    if (type === 'current') {
      setIsLoading(true);
      setPickupDropdownVisible(false);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoading(false);
        Alert.alert('Permission Denied', 'Enable location permissions to use this feature.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        const address = await reverseGeocodeCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );
        setSelectedPickup(address);
      } catch (error) {
        Alert.alert('Location Error', 'Unable to get your current location.');
        setSelectedPickup('Unknown Location');
      } finally {
        setIsLoading(false);
      }
    } else if (type === 'map') {
      navigation.navigate('Map', {
        onSelectLocation: (location, address) => {
          navigation.navigate('LocationScreen', {
            pickupAddress: address,
            destinationAddress: selectedDestination,
          });
        },
        isSelectingPickup: true,
        currentPickup: selectedPickup,
        currentDestination: selectedDestination,
      });
    } else {
      setSelectedPickup(option);
    }

    setPickupType(type);
    if (type !== 'current') {
      setPickupDropdownVisible(false);
    }
  };

  const selectDestinationOption = (option, type) => {
    if (type === 'map') {
      navigation.navigate('Map', {
        onSelectLocation: (location, address) => {
          navigation.navigate('LocationScreen', {
            destinationAddress: address,
            pickupAddress: selectedPickup,
          });
        },
        isSelectingDestination: true,
        currentPickup: selectedPickup,
        currentDestination: selectedDestination,
      });
    } else {
      setSelectedDestination(option);
      setDestinationDropdownVisible(false);
    }
  };

  const handleContinue = async () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Ensure both pickup and destination are selected
    if (selectedPickup === 'Set pickup location' || selectedDestination === 'Choose your destination') {
      Alert.alert('Missing Information', 'Please select both pickup and destination locations.');
      return;
    }

    try {
      setIsLoading(true);

      // Use Google Geocoding API to get coordinates
      const pickupLocation = await geocodeAddress(selectedPickup);
      const destinationLocation = await geocodeAddress(selectedDestination);

      if (!pickupLocation || !destinationLocation) {
        Alert.alert('Error', 'Could not determine coordinates for the selected locations.');
        return;
      }

      const pickup = {
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
        address: selectedPickup,
      };

      const dropoff = {
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
        address: selectedDestination,
      };

      console.log(pickup, dropoff);

      // Call the requestRide function from MapsApi.js
      await requestRide(pickup, dropoff);

      // Navigate to the ride confirmation or next screen if needed
      // navigation.navigate('RideDetails', { pickup, dropoff });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching location details.');
      console.error(error);
    } finally {
      setIsLoading(false);
      alert('Ride requested successfully!');
    }
  };

  const handleBack = () => {
    // Exit animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.goBack();
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f5f5f5', '#ffffff']}
        style={styles.container}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          =<TouchableOpacity onPress={() => navigationTo('RideScreen')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#111" />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}

        {/* Main content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.mapPreview,
              {
                transform: [{ translateY: mapSlideAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <Image
              source={require('../../assets/kms.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  opacity: fadeAnim,
                }}
              >
                <Text style={styles.mapText}>Where are you going today?</Text>
              </Animated.View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateY: cardSlideAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.inputContainer}>
              <View style={styles.locationIconContainer}>
                <Animated.View
                  style={[
                    styles.pickupDot,
                    {
                      transform: [{ scale: pickupDotAnim }],
                    },
                  ]}
                />
                <View style={styles.locationLine} />
                <Animated.View
                  style={[
                    styles.destinationDot,
                    {
                      transform: [{ scale: destinationDotAnim }],
                    },
                  ]}
                />
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
                    <Animated.View
                      style={{
                        transform: [
                          { rotate: pickupDropdownVisible ? '180deg' : '0deg' },
                        ],
                      }}
                    >
                      <Ionicons name="chevron-down" size={20} color="#111" />
                    </Animated.View>
                  </TouchableOpacity>
                  {pickupDropdownVisible && (
                    <Animated.View
                      style={[
                        styles.dropdownContainer,
                        {
                          opacity: fadeAnim,
                          transform: [{ translateY: slideAnim }],
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectPickupOption('Use current location', 'current')}
                      >
                        <Ionicons name="locate-outline" size={20} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Use current location</Text>
                          <Text style={styles.dropdownItemSubtext}>Fastest option</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectPickupOption('Search for a place', 'search')}
                      >
                        <Ionicons name="search-outline" size={20} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Search for a place</Text>
                          <Text style={styles.dropdownItemSubtext}>Address, landmark, business</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectPickupOption('Pick from map', 'map')}
                      >
                        <Ionicons name="map-outline" size={20} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Pick from map</Text>
                          <Text style={styles.dropdownItemSubtext}>Select a point on the map</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
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
                    <Animated.View
                      style={{
                        transform: [
                          { rotate: destinationDropdownVisible ? '180deg' : '0deg' },
                        ],
                      }}
                    >
                      <Ionicons name="chevron-down" size={20} color="#111" />
                    </Animated.View>
                  </TouchableOpacity>
                  {destinationDropdownVisible && (
                    <Animated.View
                      style={[
                        styles.dropdownContainer,
                        {
                          opacity: fadeAnim,
                          transform: [{ translateY: slideAnim }],
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectDestinationOption('Search for a place', 'search')}
                      >
                        <Ionicons name="search-outline" size={20} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Search for a place</Text>
                          <Text style={styles.dropdownItemSubtext}>Address, landmark, business</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => selectDestinationOption('Pick from map', 'map')}
                      >
                        <Ionicons name="map-outline" size={20} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={styles.dropdownItemText}>Pick from map</Text>
                          <Text style={styles.dropdownItemSubtext}>Select a point on the map</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
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
                <Ionicons name="home-outline" size={20} color="#111" />
                <View style={styles.recentTextContainer}>
                  <Text style={styles.recentItemText}>Home</Text>
                  <Text style={styles.recentItemSubtext}>123 Main St</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#777" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => selectDestinationOption('Work - 456 Office Park', 'saved')}
              >
                <Ionicons name="briefcase-outline" size={20} color="#111" />
                <View style={styles.recentTextContainer}>
                  <Text style={styles.recentItemText}>Work</Text>
                  <Text style={styles.recentItemSubtext}>456 Office Park</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#777" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Footer with continue button */}
        <Animated.View
          style={[
            styles.footer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ scale: buttonScaleAnim }],
            }}
          >
            <TouchableOpacity
              style={styles.continueButton}
              activeOpacity={0.8}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LocationScreen;