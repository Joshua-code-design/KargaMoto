import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/address'; 

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

export default AddressScreen;