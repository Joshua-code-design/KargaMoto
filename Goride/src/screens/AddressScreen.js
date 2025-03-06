import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

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
      type: 'Home',
      address: '456 Second Street, St, Penang Way, Republic Boulevard',
      isDefault: true,
    },
  ]);

  const renderAddressItem = (item) => {
    return (
      <View key={item.id} style={styles.addressItem}>
        <View style={styles.addressContent}>
          <View style={styles.addressHeader}>
            <View style={styles.typeContainer}>
              <View style={styles.heartIconContainer}>
                <Ionicons name="heart" size={16} color="#FF4545" />
              </View>
              <Text style={styles.addressType}>{item.type}</Text>
            </View>
            <View style={styles.actionIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="edit-2" size={16} color="#777" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="delete-outline" size={18} color="#777" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.addressText}>{item.address}</Text>
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
          <Ionicons name="close" size={22} color="#777" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Showing all your addresses.</Text>
      
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={18} color="#333" />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="home-outline" size={18} color="#333" />
          <Text style={styles.addButtonText}>Add Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="briefcase-outline" size={18} color="#333" />
          <Text style={styles.addButtonText}>Add Work</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      <Text style={styles.sectionTitle}>Saved</Text>
      
      <ScrollView style={styles.addressList}>
        {addresses.map(address => renderAddressItem(address))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  addButtonsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addButtonText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 16,
    marginBottom: 8,
    color: '#333',
  },
  addressList: {
    paddingHorizontal: 16,
  },
  addressItem: {
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  addressContent: {
    padding: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIconContainer: {
    marginRight: 6,
  },
  addressType: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default AddressScreen;