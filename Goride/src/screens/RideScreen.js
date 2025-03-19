import 'react-native-get-random-values';
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
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { requestRide } from '../services/MapsApi';
import { geocodeAddress, reverseGeocodeCoordinates } from '../services/Geocoding';
import * as Haptics from 'expo-haptics';
import styles from '../styles/riderScreen';

const RideScreen = () => {
  // Screen dimensions with listener for orientation changes
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  const [pickupDropdownVisible, setPickupDropdownVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState('Set pickup location');
  const [pickupType, setPickupType] = useState(null);
  const [destinationDropdownVisible, setDestinationDropdownVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Choose your destination');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const serviceType = route.params?.serviceType;
  const [service, setService] = useState(serviceType);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const mapSlideAnim = useRef(new Animated.Value(-50)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pickupDotAnim = useRef(new Animated.Value(0.8)).current;
  const destinationDotAnim = useRef(new Animated.Value(0.8)).current;

  // Dimension change listener
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => subscription?.remove();
  }, []);

  // Update service state whenever route.params.serviceType changes
  useEffect(() => {
    if (route.params?.serviceType && !service) {
      setService(route.params.serviceType);
    }
  }, [route.params?.serviceType, service]);

  // Handle other route.params updates
  useEffect(() => {
    if (route.params?.pickupAddress) {
      setSelectedPickup(route.params.pickupAddress);
    }
    if (route.params?.destinationAddress) {
      setSelectedDestination(route.params.destinationAddress);
    }
    if (route.params?.currentPickup) {
      setSelectedPickup(route.params.currentPickup);
    }
    if (route.params?.currentDestination) {
      setSelectedDestination(route.params.currentDestination);
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
        // Provide haptic feedback on successful location setting
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        Alert.alert('Location Error', 'Unable to get your current location.');
        setSelectedPickup('Unknown Location');
        // Provide haptic feedback on error
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setIsLoading(false);
      }
    } else if (type === 'map') {
      navigation.navigate('Map', {
        onSelectLocation: (location, address) => {
          navigation.navigate('LocationScreen', {
            pickupAddress: address,
            destinationAddress: selectedDestination,
            serviceType: service,
          });
        },
        isSelectingPickup: true,
        currentPickup: selectedPickup,
        currentDestination: selectedDestination,
        serviceType: service,
      });
    } else if (type === 'search') {
      navigation.navigate('SearchPlaceScreen', {
        isPickup: true,
        currentPickup: selectedPickup,
        currentDestination: selectedDestination,
        serviceType: service,
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
            serviceType: service,
          });
        },
        isSelectingDestination: true,
        currentPickup: selectedPickup,
        currentDestination: selectedDestination,
        serviceType: service,
      });
    } else if (type === 'search') {
      navigation.navigate('SearchPlaceScreen', {
        isPickup: false,
        currentPickup: selectedPickup,
        currentDestination: selectedDestination,
        serviceType: service,
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

    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

      // Navigate to the ride confirmation or next screen
      navigation.navigate('BookingScreen', { serviceType: service, pickup: pickup, destination: dropoff });
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching location details.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const animateTouchable = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const navigateTo = (screen) => {
    animateTouchable();
    navigation.navigate(screen);
  };

  // Dynamically adjust sizes based on screen dimensions
  const dynamicStyles = {
    mapHeight: dimensions.height * (dimensions.height < 700 ? 0.2 : 0.25),
    fontSize: {
      small: dimensions.width * 0.03,
      medium: dimensions.width * 0.04,
      large: dimensions.width * 0.045,
      xl: dimensions.width * 0.05,
    },
    padding: {
      xs: dimensions.width * 0.02,
      sm: dimensions.width * 0.03,
      md: dimensions.width * 0.04,
      lg: dimensions.width * 0.05,
    },
    iconSize: {
      small: dimensions.width * 0.045,
      medium: dimensions.width * 0.055,
      large: dimensions.width * 0.065,
    },
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f7f7f7', '#ffffff']}
        style={styles.container}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              paddingVertical: dynamicStyles.padding.sm,
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigateTo('LandingPageScreen')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={dynamicStyles.iconSize.medium} color="#111" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: dynamicStyles.fontSize.xl }]}>{service}</Text>
          <View style={styles.placeholder} />
        </Animated.View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#111" />
            <Text style={[styles.loadingText, { fontSize: dynamicStyles.fontSize.medium }]}>Loading...</Text>
          </View>
        )}

        {/* Main content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.mapPreview,
              {
                height: dynamicStyles.mapHeight,
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
                <Text style={[styles.mapText, { fontSize: dynamicStyles.fontSize.xl }]}>Where are you going today?</Text>
              </Animated.View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateY: cardSlideAnim }],
                opacity: fadeAnim,
                paddingHorizontal: dynamicStyles.padding.md,
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
                      width: dimensions.width * 0.035,
                      height: dimensions.width * 0.035,
                      borderRadius: dimensions.width * 0.018,
                    },
                  ]}
                />
                <View style={[styles.locationLine, { height: dimensions.height * 0.04 }]} />
                <Animated.View
                  style={[
                    styles.destinationDot,
                    {
                      transform: [{ scale: destinationDotAnim }],
                      width: dimensions.width * 0.035,
                      height: dimensions.width * 0.035,
                      borderRadius: dimensions.width * 0.018,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputsWrapper}>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.input, 
                      pickupDropdownVisible && styles.inputActive,
                      { padding: dynamicStyles.padding.sm }
                    ]}
                    activeOpacity={0.7}
                    onPress={togglePickupDropdown}
                  >
                    <Text style={[styles.inputLabel, { fontSize: dynamicStyles.fontSize.small }]}>PICKUP</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text 
                        style={[
                          styles.inputText, 
                          { fontSize: dynamicStyles.fontSize.medium, flex: 1 }
                        ]} 
                        numberOfLines={1}
                      >
                        {selectedPickup}
                      </Text>
                      <Animated.View
                        style={{
                          transform: [
                            { rotate: pickupDropdownVisible ? '180deg' : '0deg' },
                          ],
                        }}
                      >
                        <MaterialIcons name="location-on" size={dynamicStyles.iconSize.medium} color="#111" />
                      </Animated.View>
                    </View>
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
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectPickupOption('Use current location', 'current')}
                      >
                        <MaterialIcons name="my-location" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Use current location</Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>Fastest option</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectPickupOption('Search for a place', 'search')}
                      >
                        <MaterialIcons name="search" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Search for a place</Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>Address, landmark, business</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectPickupOption('Pick from map', 'map')}
                      >
                        <MaterialIcons name="map" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Pick from map</Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>Select a point on the map</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>

                <View>
                  <TouchableOpacity
                    style={[
                      styles.input, 
                      destinationDropdownVisible && styles.inputActive,
                      { padding: dynamicStyles.padding.sm }
                    ]}
                    activeOpacity={0.7}
                    onPress={toggleDestinationDropdown}
                  >
                    <Text style={[styles.inputLabel, { fontSize: dynamicStyles.fontSize.small }]}>DESTINATION</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text 
                        style={[
                          styles.inputText, 
                          { fontSize: dynamicStyles.fontSize.medium, flex: 1 }
                        ]} 
                        numberOfLines={1}
                      >
                        {selectedDestination}
                      </Text>
                      <Animated.View
                        style={{
                          transform: [
                            { rotate: destinationDropdownVisible ? '180deg' : '0deg' },
                          ],
                        }}
                      >
                        <MaterialIcons name="location-on" size={dynamicStyles.iconSize.medium} color="#4CAF50" />
                      </Animated.View>
                    </View>
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
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectDestinationOption('Search for a place', 'search')}
                      >
                        <MaterialIcons name="search" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Search for a place</Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>Address, landmark, business</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectDestinationOption('Pick from map', 'map')}
                      >
                        <MaterialIcons name="map" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Pick from map</Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>Select a point on the map</Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.recentLocations}>
              <Text style={[styles.recentTitle, { fontSize: dynamicStyles.fontSize.large }]}>Recent Locations</Text>
              <TouchableOpacity
                style={[styles.recentItem, { padding: dynamicStyles.padding.sm }]}
                onPress={() => selectDestinationOption('Home - 123 Main St', 'saved')}
              >
                <MaterialIcons name="home" size={dynamicStyles.iconSize.small} color="#111" />
                <View style={styles.recentTextContainer}>
                  <Text style={[styles.recentItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Home</Text>
                  <Text style={[styles.recentItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>123 Main St</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={dynamicStyles.iconSize.small * 0.8} color="#777" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recentItem, { padding: dynamicStyles.padding.sm }]}
                onPress={() => selectDestinationOption('Work - 456 Office Park', 'saved')}
              >
                <MaterialIcons name="work" size={dynamicStyles.iconSize.small} color="#111" />
                <View style={styles.recentTextContainer}>
                  <Text style={[styles.recentItemText, { fontSize: dynamicStyles.fontSize.medium }]}>Work</Text>
                  <Text style={[styles.recentItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>456 Office Park</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={dynamicStyles.iconSize.small * 0.8} color="#777" />
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
              padding: dynamicStyles.padding.md,
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ scale: buttonScaleAnim }],
            }}
          >
            <TouchableOpacity
              style={[styles.continueButton, { padding: dynamicStyles.padding.sm }]}
              activeOpacity={0.8}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={[styles.continueButtonText, { fontSize: dynamicStyles.fontSize.large }]}>Continue</Text>
              <MaterialIcons name="arrow-forward" size={dynamicStyles.iconSize.small} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RideScreen;