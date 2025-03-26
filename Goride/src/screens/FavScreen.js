// File: src/screens/AddressScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { 
  addFavorites, 
  getFavorites, 
  deleteFavoriteAddress 
} from '../services/Address';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { X, Trash2 } from 'lucide-react-native';

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

const AddressScreen = () => {
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
      console.log('favorites', favorites);

      if (favorites?.data) {
        const { homes, works } = favorites.data;
        const formattedAddresses = [];

        // Add home addresses
        if (homes && homes.length > 0) {
          formattedAddresses.push({
            id: 'home',
            type: 'Home',
            address: homes[0].address,
            latitude: homes[0].latitude,
            longitude: homes[0].longitude,
            isDefault: true,
          });
        }

        // Add work addresses
        if (works && works.length > 0) {
          works.forEach((work, index) => {
            formattedAddresses.push({
              id: `work-${index}`,
              type: 'Work',
              address: work.address,
              latitude: work.latitude,
              longitude: work.longitude,
              isDefault: homes.length === 0 && index === 0,
            });
          });
        }

        setAddresses(formattedAddresses);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
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
      let result;
      if (addressToDelete.type === 'Home') {
        result = await deleteFavoriteAddress('home');
      } else if (addressToDelete.type === 'Work') {
        result = await deleteFavoriteAddress('work', addressToDelete.address);
      }

      if (result) {
        // Refresh addresses
        await fetchAddresses();
        
        // Close delete modal
        setIsDeleteModalVisible(false);
        setAddressToDelete(null);

        // Show success message
        Alert.alert('Success', `${addressToDelete.type} address deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      Alert.alert('Error', 'Failed to delete address');
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
          console.log('Address saved successfully:', result);
          
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
      <View style={[
        styles.bottomNav,
        {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        }
      ]}>
        {[
          { name: 'home', label: 'Home', screen: 'LandingPageScreen', active: false },
          { name: 'heart-outline', label: 'Favorites', screen: 'FavScreen', active: true },
          { name: 'person-outline', label: 'Profile', screen: 'ProfilesettingScreen', active: false },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => navigateTo(item.screen)}
            activeOpacity={0.7}
          >
            {item.active && (
              <View style={[
                styles.activeIndicator, 
                { backgroundColor: COLORS.secondary }
              ]} />
            )}
            <Ionicons
              name={item.name}
              size={deviceSize.isTablet ? 24 : 22}
              color={item.active ? COLORS.secondary : COLORS.darkGray}
            />
            <Text
              style={[
                styles.navText,
                { 
                  fontSize: fontSize.small, 
                  color: item.active ? COLORS.secondary : COLORS.darkGray,
                  fontWeight: item.active ? '600' : '400'
                }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    marginLeft: hp(13),
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    marginBottom: hp(2),
    marginHorizontal: hp(4),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 16,
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  navText: {
    marginTop: 4,
  },

  deleteButton: {
    padding: scale(8),
  },
  modalDeleteText: {
    fontSize: scale(14),
    color: '#666666',
    textAlign: 'center',
    marginBottom: scale(20),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    marginHorizontal: scale(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  deleteConfirmButton: {
    backgroundColor: '#E53935',
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: scale(14),
    fontWeight: '500',
  },
  deleteConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: '500',
  },
});

export default AddressScreen;