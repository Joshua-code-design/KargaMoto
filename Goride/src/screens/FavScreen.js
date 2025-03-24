import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addFavorites, getFavorites } from '../services/Address'; // Import getFavorites

// Get device dimensions
const { width } = Dimensions.get('window');

// Responsive scaling function
const scale = (size) => (width / 375) * size;

const AddressScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // State for modal and addresses
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addresses, setAddresses] = useState([]); // State to store fetched addresses

  // Fetch addresses from the database when the component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const favorites = await getFavorites();
        console.log('favorites', favorites);
  
        if (favorites?.data) {
          const { homes, works } = favorites.data;
          const formattedAddresses = [];
  
          // Add home if it exists
          if (homes.length > 0) {
            formattedAddresses.push({
              id: 'home',
              type: 'Home',
              address: homes[0].address,
              latitude: homes[0].latitude,
              longitude: homes[0].longitude,
              isDefault: true, // Assuming home is default
            });
          }
  
          // Add all work addresses
          if (works.length > 0) {
            works.forEach((work, index) => {
              formattedAddresses.push({
                id: `work-${index}`, // Unique ID for multiple work addresses
                type: 'Work',
                address: work.address,
                latitude: work.latitude,
                longitude: work.longitude,
                isDefault: homes.length === 0 && index === 0, // Default if no home
              });
            });
          }
  
          setAddresses(formattedAddresses);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };
  
    fetchAddresses();
  }, []);
  

  // Handle the selected location passed from Map.js
  useEffect(() => {
    if (route.params?.selectedLocation) {
      const { address, latitude, longitude } = route.params.selectedLocation;
      setSelectedLocation({ address, latitude, longitude });
      setIsModalVisible(true); // Show modal to select address type
    }
  }, [route.params?.selectedLocation]);

  // Add a new address directly to the database
  const handleAddAddress = async (type) => {
    if (selectedLocation) {
      const { latitude, longitude, address } = selectedLocation;

      // Prepare the data for addFavorites
      const home = type === 'Home' ? { latitude, longitude, address } : null;
      const work = type === 'Work' ? { latitude, longitude, address } : null;

      // Call addFavorites to store the address in the database
      const result = await addFavorites(home, work);

      if (result) {
        console.log('Address saved successfully:', result);
        // Navigate to FavScreen
        navigation.navigate('FavScreen');
      } else {
        console.error('Failed to save address.');
      }

      // Close the modal
      setIsModalVisible(false);
    }
  };

  // Render each address item
  const renderAddressItem = (item) => {
    return (
      <View key={item.id} style={styles.addressItem}>
        <View style={styles.addressContent}>
          <View style={styles.addressHeader}>
            <View style={styles.typeContainer}>
              <View style={styles.heartIconContainer}>
                <Ionicons
                  name={item.type === 'Home' ? 'home' : 'briefcase'}
                  size={scale(16)}
                  color="#FF4545"
                />
              </View>
              <Text style={styles.addressType}>{item.type}</Text>
            </View>
          </View>
          <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LandingPageScreen')}>
          <Ionicons name="arrow-back" size={scale(22)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Addresses</Text>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={scale(22)} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Manage your delivery addresses</Text>

      {/* Add Address Buttons */}
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Map', { isSelectingAddress: true })}>
          <Ionicons name="add-outline" size={scale(18)} color="#333" />
          <Text style={styles.addButtonText}>Add Address</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Saved Addresses Section */}
      <Text style={styles.sectionTitle}>Saved Addresses</Text>

      {/* Display saved addresses dynamically */}
      {addresses.length > 0 ? (
        <ScrollView contentContainerStyle={styles.addressList}>
          {addresses.map((address) => renderAddressItem(address))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={scale(48)} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>You don't have any saved addresses yet.</Text>
        </View>
      )}

      {/* Modal for Address Type Selection */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Address Type</Text>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleAddAddress('Home')}>
              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleAddAddress('Work')}>
              <Text>Work</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#222222',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  closeButton: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  subtitle: {
    fontSize: scale(14),
    color: '#666666',
    marginHorizontal: '5%',
    marginTop: scale(12),
    marginBottom: scale(16),
  },
  addButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: '5%',
    marginBottom: scale(20),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: scale(8),
    paddingVertical: scale(10),
    paddingHorizontal: scale(16),
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  addButtonText: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#333333',
    marginLeft: scale(8),
  },
  divider: {
    height: scale(8),
    backgroundColor: '#F7F7F7',
    width: '100%',
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#222222',
    marginHorizontal: '5%',
    marginVertical: scale(16),
  },
  addressList: {
    paddingHorizontal: '5%',
  },
  addressItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    marginBottom: scale(16),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIconContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#FFEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(8),
  },
  addressType: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#333333',
  },
  addressText: {
    fontSize: scale(14),
    color: '#666666',
    lineHeight: scale(20),
  },
  defaultBadge: {
    backgroundColor: '#E9F7FF',
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    alignSelf: 'flex-start',
    marginTop: scale(8),
  },
  defaultText: {
    fontSize: scale(12),
    color: '#0088CC',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  emptyStateText: {
    fontSize: scale(15),
    color: '#777777',
    textAlign: 'center',
    marginTop: scale(12),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: scale(20),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
  },
  modalTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#222222',
    marginBottom: scale(16),
  },
  modalOption: {
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
});

export default AddressScreen;