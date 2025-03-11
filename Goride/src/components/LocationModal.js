import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const LocationModal = ({ visible, onClose }) => {
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
  };

  const toggleDestinationDropdown = () => {
    setDestinationDropdownVisible(!destinationDropdownVisible);
  };

  const selectPickupOption = async (option, type) => {
    if (type === 'current') {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location permissions to use this feature.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address.length > 0) {
        setSelectedPickup(`${address[0].name}, ${address[0].city}, ${address[0].region}`);
      } else {
        setSelectedPickup('Unknown Location');
      }
    } else if (type === 'map') {
      navigation.navigate('Map', {
        onSelectLocation: (location, address) => {
          navigation.navigate('LocationModal', {
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
          navigation.navigate('LocationModal', {
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

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <View>
                <TouchableOpacity
                  style={[styles.input, pickupDropdownVisible && styles.inputActive]}
                  activeOpacity={0.7}
                  onPress={togglePickupDropdown}
                >
                  <Ionicons name="location-outline" size={20} color="#333" />
                  <Text style={styles.inputText}>{selectedPickup}</Text>
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
                  <Ionicons name="navigate-outline" size={20} color="green" />
                  <Text style={styles.inputText}>{selectedDestination}</Text>
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
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: width * 0.05,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: height * 0.85,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
    marginBottom: 5,
  },
  inputContainer: {
    width: '100%',
    marginVertical: height * 0.01,
    zIndex: 10,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: height * 0.018,
    borderRadius: 10,
    marginBottom: height * 0.01,
  },
  inputActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  inputText: {
    marginLeft: 10,
    color: '#333',
    fontSize: width * 0.04,
    flex: 1,
  },
  dropdownContainer: {
    backgroundColor: '#f2f2f2',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -height * 0.01,
    marginBottom: height * 0.01,
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
    color: '#333',
    fontSize: width * 0.04,
    fontWeight: '500',
  },
  dropdownItemSubtext: {
    color: '#777',
    fontSize: width * 0.03,
    marginTop: 2,
  },
});

export default LocationModal;