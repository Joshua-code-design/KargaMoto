import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  addFavorites, 
  getFavorites, 
  deleteFavorites 
} from '../../services/Address';
import { X, Trash2 } from 'lucide-react-native';
import ButtonBar from '../../components/buttonbarFav';
import styles from'../../styles/fav';

// Get device dimensions
const { width } = Dimensions.get('window');

// Responsive scaling function
const scale = (size) => (width / 375) * size;

// Color palette
const COLORS = {
  primary: '#1A2B4D',       // Deep Navy Blue
  secondary: '#2E7D32',     // Forest Green
  tertiary: '#26A69A',      // Soft Teal
  accent: '#D4AF37',        // Muted Gold
  background: '#F5F5F5',    // Light Gray
  white: '#FFFFFF',         // White
  lightGray: '#E0E0E0',     // Very Light Gray
  darkGray: '#333333',      // Charcoal Gray
  error: '#E53935',         // Bright Red
};

// Device size detection
const deviceSize = {
  isSmallDevice: width < 375,
  isTablet: width >= 768
};

// Responsive sizing
const fontSize = {
  small: deviceSize.isSmallDevice ? 12 : (deviceSize.isTablet ? 16 : 14),
  medium: deviceSize.isSmallDevice ? 14 : (deviceSize.isTablet ? 20 : 16),
  large: deviceSize.isSmallDevice ? 18 : (deviceSize.isTablet ? 28 : 22),
  xlarge: deviceSize.isSmallDevice ? 24 : (deviceSize.isTablet ? 36 : 30),
};

const spacing = {
  xs: deviceSize.isSmallDevice ? 4 : (deviceSize.isTablet ? 12 : 8),
  small: deviceSize.isSmallDevice ? 8 : (deviceSize.isTablet ? 16 : 12),
  medium: deviceSize.isSmallDevice ? 12 : (deviceSize.isTablet ? 24 : 16),
  large: deviceSize.isSmallDevice ? 16 : (deviceSize.isTablet ? 32 : 24),
};

const FavScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // State management
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  // Fetch addresses function
  const fetchAddresses = useCallback(async () => {
    try {
      const favorites = await getFavorites();
    
      if (favorites?.data) {
        const { homes, works } = favorites.data;
        const formattedAddresses = [];

        // Add home addresses
        if (homes && homes.length > 0) {
          homes.forEach((home) => {
            formattedAddresses.push({
              id: home._id, // Use the actual MongoDB _id
              type: 'Home',
              address: home.address,
              latitude: home.latitude,
              longitude: home.longitude,
              isDefault: formattedAddresses.length === 0 // First item is default
            });
          });
        }

        // Add work addresses
        if (works && works.length > 0) {
          works.forEach((work) => {
            formattedAddresses.push({
              id: work._id, // Use the actual MongoDB _id
              type: 'Work',
              address: work.address,
              latitude: work.latitude,
              longitude: work.longitude,
              isDefault: formattedAddresses.length === 0 // First item is default if no homes
            });
          });
        }

        setAddresses(formattedAddresses);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // If it's a 404, treat it as empty list
        console.warn('No favorites found — treating as empty list.');
        setAddresses([]);
      } else {
        console.error('Error fetching addresses:', error);
      }
    }
  }, []);

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Handle selected location from Map screen
  useEffect(() => {
    if (route.params?.selectedLocation) {
      const { address, latitude, longitude } = route.params.selectedLocation;
      setSelectedLocation({ address, latitude, longitude });
      setIsModalVisible(true);
    }
  }, [route.params?.selectedLocation]);

  // Handle address deletion
  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
        
    try {
      // Now passing the address ID instead of the address string
      const result = await deleteFavorites(addressToDelete.id);
      
      if (result.success) {
        await fetchAddresses();
        setIsDeleteModalVisible(false);
        Alert.alert('Success', 'Address deleted successfully');
      } else {
        Alert.alert('Error', result.error || 'Failed to delete address');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete address');
      console.error('Delete error:', error);
    }
  };

  // Confirm delete modal
  const showDeleteConfirmation = (address) => {
    setAddressToDelete(address);
    setIsDeleteModalVisible(true);
  };

  // Add new address to database
  const handleAddAddress = async (type) => {
    if (selectedLocation) {
      const { latitude, longitude, address } = selectedLocation;

      const home = type === 'Home' ? { latitude, longitude, address } : null;
      const work = type === 'Work' ? { latitude, longitude, address } : null;

      try {
        const result = await addFavorites(home, work);

        if (result) {
          // Refresh addresses immediately
          await fetchAddresses();

          // Navigate to Favorites screen
          navigation.navigate('FavScreen');
        } else {
          console.error('Failed to save address.');
        }

        // Close modal
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error adding address:', error);
      }
    }
  };

  // Navigation helper
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  // Render individual address item
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
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => showDeleteConfirmation(item)}
            >
              <Trash2 size={scale(18)} color="#E53935" />
            </TouchableOpacity>
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
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('LandingPageScreen')}
        >
          <Ionicons name="arrow-back" size={scale(22)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Addresses</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Manage your delivery addresses</Text>

      {/* Add Address Buttons */}
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.navigate('Map', { isSelectingAddress: true })}
        >
          <Ionicons name="add-outline" size={scale(18)} color="#333" />
          <Text style={styles.addButtonText}>Add Address</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Saved Addresses Section */}
      <Text style={styles.sectionTitle}>Saved Addresses</Text>

      {/* Display saved addresses */}
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
            {/* Close/Delete Icon */}
            <TouchableOpacity 
              style={styles.closeIconContainer} 
              onPress={() => setIsModalVisible(false)}
            >
              <X color="gray" size={24} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Select Address Type</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleAddAddress('Home')}
            >
              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleAddAddress('Work')}
            >
              <Text>Work</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeIconContainer} 
              onPress={() => setIsDeleteModalVisible(false)}
            >
              <X color="gray" size={24} />
            </TouchableOpacity>
            
            <Text style={styles.modalTitle}>Delete Address</Text>
            <Text style={styles.modalDeleteText}>
              Are you sure you want to delete this {addressToDelete?.type} address?
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={handleDeleteAddress}
              >
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <ButtonBar isTablet={deviceSize.isTablet} />
    </SafeAreaView>
  );
};

export default FavScreen;