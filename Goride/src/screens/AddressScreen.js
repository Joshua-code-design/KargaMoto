import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  StyleSheet
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

// Get device dimensions
const { width } = Dimensions.get('window');

// Responsive scaling function
const scale = (size) => (width / 375) * size;

const AddressScreen = () => {
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      type: 'Home',
      address: '123 Main Street, St, Penang Way, Republic Boulevard',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Work',
      address: '456 Second Street, St, Penang Way, Republic Boulevard',
      isDefault: false,
    },
  ]);

  // Update dimensions on orientation change
  useEffect(() => {
    const updateLayout = () => {
      // This forces a re-render when dimensions change
      setAddresses([...addresses]);
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => {
      // Clean up event listener on component unmount
      Dimensions.removeEventListener('change', updateLayout);
    };
  }, [addresses]);

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
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="edit-2" size={scale(16)} color="#777" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="delete-outline" size={scale(18)} color="#777" />
              </TouchableOpacity>
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
      
      <View style={styles.header}>
        <Text style={styles.title}>Addresses</Text>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={scale(22)} color="#777" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Manage your delivery addresses</Text>
      
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="home-outline" size={scale(18)} color="#333" />
          <Text style={styles.addButtonText}>Add Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="briefcase-outline" size={scale(18)} color="#333" />
          <Text style={styles.addButtonText}>Add Work</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.sectionTitle}>Saved Addresses</Text>
      
      {addresses.length > 0 ? (
        <ScrollView contentContainerStyle={styles.addressListContent} style={styles.addressList}>
          {addresses.map(address => renderAddressItem(address))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="location-outline" size={scale(48)} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>
            You don't have any saved addresses yet.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// Move styles to StyleSheet for better performance
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
    flex: 1,
  },
  addressListContent: {
    paddingHorizontal: '5%',
    paddingBottom: scale(20),
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
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(8),
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
  }
});

export default AddressScreen;