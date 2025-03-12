import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
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
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const mapSlideAnim = useRef(new Animated.Value(-50)).current;
  const cardSlideAnim = useRef(new Animated.Value(100)).current;
  const buttonScaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animated dots
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
    setPickupDropdownVisible(false);
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

  const handleContinue = () => {
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
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Journey</Text>
          <View style={styles.placeholder} />
        </Animated.View>
        
        {/* Main content */}
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.mapPreview,
              {
                transform: [{ translateY: mapSlideAnim }],
                opacity: fadeAnim
              }
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
                  opacity: fadeAnim
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
                opacity: fadeAnim
              }
            ]}
          >
            <View style={styles.inputContainer}>
              <View style={styles.locationIconContainer}>
                <Animated.View 
                  style={[
                    styles.pickupDot,
                    { 
                      transform: [{ scale: pickupDotAnim }],
                    }
                  ]} 
                />
                <View style={styles.locationLine} />
                <Animated.View 
                  style={[
                    styles.destinationDot,
                    { 
                      transform: [{ scale: destinationDotAnim }],
                    }
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
                        transform: [{ 
                          rotate: pickupDropdownVisible ? '180deg' : '0deg'
                        }]
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
                          transform: [{ translateY: slideAnim }]
                        }
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
                        transform: [{ 
                          rotate: destinationDropdownVisible ? '180deg' : '0deg'
                        }]
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
                          transform: [{ translateY: slideAnim }]
                        }
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
              opacity: fadeAnim
            }
          ]}
        >
          <Animated.View 
            style={{
              transform: [{ scale: buttonScaleAnim }]
            }}
          >
            <TouchableOpacity 
              style={styles.continueButton} 
              activeOpacity={0.8}
              onPress={handleContinue}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: '600',
    color: '#111',
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
    height: '120%',
    opacity: 0.8, // Reduced opacity for black and white theme
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', // Darker overlay for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: '#fff',
    marginTop:'25%',
    fontSize: width * 0.05,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
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
    backgroundColor: '#111',
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
    backgroundColor: '#333',
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
    borderColor: '#e0e0e0',
  },
  inputActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
    borderColor: '#222',
  },
  inputLabel: {
    fontSize: width * 0.03,
    color: '#777',
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 1,
  },
  inputText: {
    color: '#111',
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
    borderColor: '#222',
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
    borderBottomColor: '#e0e0e0',
  },
  dropdownTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  dropdownItemText: {
    color: '#111',
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
    color: '#111',
    marginBottom: height * 0.015,
    letterSpacing: 0.5,
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
    color: '#111',
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
    backgroundColor: '#111',
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
    letterSpacing: 0.5,
  }
});

export default LocationScreen;