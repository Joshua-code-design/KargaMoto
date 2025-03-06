import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LocationModal = ({ visible, onClose, onSelectLocation }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            
            {/* Pickup & Destination Inputs */}
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.input} activeOpacity={0.7}>
                <Ionicons name="location-outline" size={20} color="#333" />
                <Text style={styles.inputText}>Choose your pickup</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.input} activeOpacity={0.7}>
                <Ionicons name="navigate-outline" size={20} color="green" />
                <Text style={styles.inputText}>Choose your destination</Text>
              </TouchableOpacity>
            </View>
            
            {/* Recent & Saved Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity style={styles.toggleButtonActive}><Text style={styles.toggleActiveText}>Recent</Text></TouchableOpacity>
              <TouchableOpacity style={styles.toggleButton}><Text style={styles.toggleText}>Saved</Text></TouchableOpacity>
            </View>
            
            {/* Location List */}
            <View style={styles.locationListContainer}>
              <TouchableOpacity 
                style={styles.locationItem} 
                onPress={() => onSelectLocation('TNC, Barangay 15, Talisay City, Negros Occidental')}
                activeOpacity={0.6}
              >
                <Ionicons name="time-outline" size={20} color="#333" />
                <Text numberOfLines={2} style={styles.locationText}>TNC, Barangay 15, Talisay City, Negros Occidental</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.locationItem} 
                onPress={() => onSelectLocation('TNC, Barangay 15, Talisay City, Negros Occidental')}
                activeOpacity={0.6}
              >
                <Ionicons name="heart-outline" size={20} color="red" />
                <Text numberOfLines={2} style={styles.locationText}>TNC, Barangay 15, Talisay City, Negros Occidental</Text>
              </TouchableOpacity>
            </View>
            
            {/* Choose on Maps Button */}
            <TouchableOpacity style={styles.mapButton} activeOpacity={0.8}>
              <Text style={styles.mapButtonText}>Choose on Maps</Text>
            </TouchableOpacity>
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
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: height * 0.018,
    borderRadius: 10,
    marginBottom: height * 0.01,
  },
  inputText: {
    marginLeft: 10,
    color: '#333',
    fontSize: width * 0.04,
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.015,
    marginTop: height * 0.01,
  },
  toggleButton: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  toggleButtonActive: {
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.03,
    backgroundColor: '#333',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  toggleActiveText: {
    color: 'white',
    fontWeight: '500',
    fontSize: width * 0.035,
  },
  toggleText: {
    color: '#333',
    fontSize: width * 0.035,
  },
  locationListContainer: {
    maxHeight: height * 0.3,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.015,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  locationText: {
    marginLeft: 10,
    color: '#333',
    fontSize: width * 0.035,
    flex: 1,
  },
  mapButton: {
    marginTop: height * 0.025,
    padding: height * 0.018,
    backgroundColor: 'black',
    borderRadius: 10,
    alignItems: 'center',
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
});

export default LocationModal;