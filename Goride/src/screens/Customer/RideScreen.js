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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { geocodeAddress, reverseGeocodeCoordinates } from '../../services/Geocoding';
import { getFavorites } from '../../services/Address';
import * as Haptics from 'expo-haptics';
import styles from '../../styles/ride';

const RideScreen = () => {
  // Screen dimensions with listener for orientation changes
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  // Location state management
  const [pickupDropdownVisible, setPickupDropdownVisible] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState('Set pickup location');
  const [destinationDropdownVisible, setDestinationDropdownVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('Choose your destination');
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteLocations, setFavoriteLocations] = useState({
    homes: [],
    works: []
  });
  
  // Navigation
  const navigation = useNavigation();
  const route = useRoute();
  const serviceType = route.params?.serviceType;
  const [service, setService] = useState(serviceType);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonAnim = useRef(new Animated.Value(0.95)).current;
  const locationDotsAnim = useRef({
    pickup: new Animated.Value(1),
    destination: new Animated.Value(1)
  }).current;

  // Fetch favorite locations
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        const data = response.data;
    
        // Process home locations
        const homes = data.homes?.map(home => ({
          id: home._id,
          name: 'Home',
          address: home.address,
          latitude: home.latitude,
          longitude: home.longitude,
          type: 'home'
        })) || [];
    
        // Process work locations
        const works = data.works?.map(work => ({
          id: work._id,
          name: 'Work',
          address: work.address,
          latitude: work.latitude,
          longitude: work.longitude,
          type: 'work'
        })) || [];
    
        setFavoriteLocations({ homes, works });
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);
  
  // Dimension change listener
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  // Update service state and location data when route params change
  useEffect(() => {
    if (route.params?.serviceType && !service) {
      setService(route.params.serviceType);
    }
    
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
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
        easing: Easing.elastic(1.1),
      }),
    ]).start();
  }, []);

  // Animation for pickup location tap
  const animatePickupDot = () => {
    Animated.sequence([
      Animated.timing(locationDotsAnim.pickup, {
        toValue: 1.3,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(locationDotsAnim.pickup, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  // Animation for destination location tap
  const animateDestinationDot = () => {
    Animated.sequence([
      Animated.timing(locationDotsAnim.destination, {
        toValue: 1.3,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(locationDotsAnim.destination, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  // Toggle pickup dropdown with animation
  const togglePickupDropdown = () => {
    animatePickupDot();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPickupDropdownVisible(!pickupDropdownVisible);
    if (destinationDropdownVisible) setDestinationDropdownVisible(false);
  };

  // Toggle destination dropdown with animation
  const toggleDestinationDropdown = () => {
    animateDestinationDot();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDestinationDropdownVisible(!destinationDropdownVisible);
    if (pickupDropdownVisible) setPickupDropdownVisible(false);
  };

  // Handle pickup option selection
  const selectPickupOption = async (option, type) => {
    if (type === 'current') {
      setIsLoading(true);
      setPickupDropdownVisible(false);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLoading(false);
        Alert.alert('Permission Needed', 'Please enable location access to use this feature.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        const address = await reverseGeocodeCoordinates(
          location.coords.latitude,
          location.coords.longitude
        );
        setSelectedPickup(address);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        Alert.alert('Location Error', 'Unable to determine your current location.');
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
    } else if (type === 'saved') {
      setSelectedPickup(option);
      setPickupDropdownVisible(false);
    }
  };

  // Handle destination option selection
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
    } else if (type === 'saved') {
      setSelectedDestination(option);
      setDestinationDropdownVisible(false);
    }
  };

  // Handle continue button press
  const handleContinue = async () => {
    Animated.sequence([
      Animated.timing(buttonAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        easing: Easing.elastic(1.2),
      }),
    ]).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (selectedPickup === 'Set pickup location' || selectedDestination === 'Choose your destination') {
      Alert.alert('Missing Information', 'Please select both pickup and destination locations.');
      return;
    }

    try {
      setIsLoading(true);
      const pickupLocation = await geocodeAddress(selectedPickup);
      const destinationLocation = await geocodeAddress(selectedDestination);

      if (!pickupLocation || !destinationLocation) {
        Alert.alert('Location Error', 'Could not determine coordinates for the selected locations.');
        return;
      }

      navigation.navigate('BookingScreen', { 
        serviceType: service, 
        pickup: {
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          address: selectedPickup,
        }, 
        destination: {
          latitude: destinationLocation.latitude,
          longitude: destinationLocation.longitude,
          address: selectedDestination,
        } 
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate to different screen
  const navigateTo = (screen) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen);
  };

  // Dynamic styles based on screen dimensions
  const dynamicStyles = {
    mapHeight: dimensions.height * (dimensions.height < 700 ? 0.22 : 0.25),
    fontSize: {
      small: Math.max(11, dimensions.width * 0.03),
      medium: Math.max(13, dimensions.width * 0.035),
      large: Math.max(15, dimensions.width * 0.042),
      xl: Math.max(17, dimensions.width * 0.048),
    },
    padding: {
      xs: dimensions.width * 0.02,
      sm: dimensions.width * 0.03,
      md: dimensions.width * 0.04,
      lg: dimensions.width * 0.05,
    },
    iconSize: {
      small: Math.max(16, dimensions.width * 0.045),
      medium: Math.max(20, dimensions.width * 0.055),
      large: Math.max(24, dimensions.width * 0.065),
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
              paddingVertical: dynamicStyles.padding.sm,
            },
          ]}
        >
          <TouchableOpacity 
            onPress={() => navigateTo('LandingPageScreen')} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={dynamicStyles.iconSize.medium} color="#111" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontSize: dynamicStyles.fontSize.xl }]}>
            {service || 'Book a Ride'}
          </Text>
          <View style={styles.placeholder} />
        </Animated.View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#111" />
            <Text style={[styles.loadingText, { fontSize: dynamicStyles.fontSize.medium }]}>
              Getting your ride ready...
            </Text>
          </View>
        )}

        {/* Main content */}
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.mapPreview,
              {
                height: dynamicStyles.mapHeight,
                opacity: fadeAnim,
              },
            ]}
          >
            <Image
              source={require('../../../assets/kms.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <Text style={[styles.mapText, { fontSize: dynamicStyles.fontSize.xl }]}>
                Where are you going today?
              </Text>
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
                      transform: [{ scale: locationDotsAnim.pickup }],
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
                      transform: [{ scale: locationDotsAnim.destination }],
                      width: dimensions.width * 0.035,
                      height: dimensions.width * 0.035,
                      borderRadius: dimensions.width * 0.018,
                    },
                  ]}
                />
              </View>

              <View style={styles.inputsWrapper}>
                {/* Pickup input */}
                <View>
                  <TouchableOpacity
                    style={[
                      styles.input, 
                      pickupDropdownVisible && styles.inputActive,
                      { padding: dynamicStyles.padding.sm }
                    ]}
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
                        ellipsizeMode="tail"
                      >
                        {selectedPickup}
                      </Text>
                      <MaterialIcons 
                        name="location-on" 
                        size={dynamicStyles.iconSize.medium} 
                        color="#111" 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {/* Pickup dropdown */}
                  {pickupDropdownVisible && (
                    <Animated.View
                      style={[
                        styles.dropdownContainer,
                        { opacity: fadeAnim }
                      ]}
                    >
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectPickupOption('Use current location', 'current')}
                      >
                        <MaterialIcons name="my-location" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                            Use current location
                          </Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>
                            Fastest option
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectPickupOption('Search for a place', 'search')}
                      >
                        <MaterialIcons name="search" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                            Search for a place
                          </Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>
                            Address, landmark, business
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectPickupOption('Pick from map', 'map')}
                      >
                        <MaterialIcons name="map" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                            Pick from map
                          </Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>
                            Select a point on the map
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>

                {/* Destination input */}
                <View>
                  <TouchableOpacity
                    style={[
                      styles.input, 
                      destinationDropdownVisible && styles.inputActive,
                      { padding: dynamicStyles.padding.sm }
                    ]}
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
                        ellipsizeMode="tail"
                      >
                        {selectedDestination}
                      </Text>
                      <MaterialIcons 
                        name="location-on" 
                        size={dynamicStyles.iconSize.medium} 
                        color="#4CAF50" 
                      />
                    </View>
                  </TouchableOpacity>
                  
                  {/* Destination dropdown */}
                  {destinationDropdownVisible && (
                    <Animated.View
                      style={[
                        styles.dropdownContainer,
                        { opacity: fadeAnim }
                      ]}
                    >
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectDestinationOption('Search for a place', 'search')}
                      >
                        <MaterialIcons name="search" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                            Search for a place
                          </Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>
                            Address, landmark, business
                          </Text>
                        </View>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.dropdownItem, { padding: dynamicStyles.padding.sm }]}
                        onPress={() => selectDestinationOption('Pick from map', 'map')}
                      >
                        <MaterialIcons name="map" size={dynamicStyles.iconSize.small} color="#111" />
                        <View style={styles.dropdownTextContainer}>
                          <Text style={[styles.dropdownItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                            Pick from map
                          </Text>
                          <Text style={[styles.dropdownItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}>
                            Select a point on the map
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </View>
              </View>
            </View>

            {/* Favorite locations */}
            <View style={styles.recentLocations}>
              <Text style={[styles.recentTitle, { fontSize: dynamicStyles.fontSize.large }]}>
                Favorite Locations
              </Text>

              {/* Home locations */}
              {favoriteLocations.homes.length > 0 && favoriteLocations.homes.map((home, index) => (
                <TouchableOpacity
                  key={`home-${index}`}
                  style={[styles.recentItem, { padding: dynamicStyles.padding.sm }]}
                  onPress={() => selectDestinationOption(home.address, 'saved')}
                >
                  <MaterialIcons 
                    name="home" 
                    size={dynamicStyles.iconSize.small} 
                    color="#111" 
                  />
                  <View style={styles.recentTextContainer}>
                    <Text style={[styles.recentItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                      {home.name}
                    </Text>
                    <Text 
                      style={[styles.recentItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {home.address}
                    </Text>
                  </View>
                  <MaterialIcons 
                    name="arrow-forward-ios" 
                    size={dynamicStyles.iconSize.small * 0.8} 
                    color="#777" 
                  />
                </TouchableOpacity>
              ))}

              {/* Work locations */}
              {favoriteLocations.works.length > 0 && favoriteLocations.works.map((work, index) => (
                <TouchableOpacity
                  key={`work-${index}`}
                  style={[styles.recentItem, { padding: dynamicStyles.padding.sm }]}
                  onPress={() => selectDestinationOption(work.address, 'saved')}
                >
                  <MaterialIcons 
                    name="work" 
                    size={dynamicStyles.iconSize.small} 
                    color="#111" 
                  />
                  <View style={styles.recentTextContainer}>
                    <Text style={[styles.recentItemText, { fontSize: dynamicStyles.fontSize.medium }]}>
                      {work.name}
                    </Text>
                    <Text 
                      style={[styles.recentItemSubtext, { fontSize: dynamicStyles.fontSize.small }]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {work.address}
                    </Text>
                  </View>
                  <MaterialIcons 
                    name="arrow-forward-ios" 
                    size={dynamicStyles.iconSize.small * 0.8} 
                    color="#777" 
                  />
                </TouchableOpacity>
              ))}

              {/* Empty state */}
              {favoriteLocations.homes.length === 0 && favoriteLocations.works.length === 0 && (
                <Text style={[styles.noFavoritesText, { fontSize: dynamicStyles.fontSize.medium }]}>
                  No favorite locations saved yet
                </Text>
              )}
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
              transform: [{ scale: buttonAnim }],
            }}
          >
            <TouchableOpacity
              style={[styles.continueButton, { padding: dynamicStyles.padding.sm }]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <Text style={[styles.continueButtonText, { fontSize: dynamicStyles.fontSize.large }]}>
                Continue
              </Text>
              <MaterialIcons 
                name="arrow-forward" 
                size={dynamicStyles.iconSize.small} 
                color="#fff" 
              />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RideScreen;