import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LocationModal from './LocationModal'; // Import the LocationModal

const PopupModal = ({ visible, onCancel, onSelect }) => {
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const handleRideSelect = () => {
    setLocationModalVisible(true); // Show the LocationModal when Ride is selected
  };

  return (
    <>
      <Modal transparent={true} visible={visible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Service</Text>
            
            <View style={styles.buttonContainer}>
              {/* Ride Button */}
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={handleRideSelect} // Open LocationModal instead of alert
              >
                <Image source={require('../../assets/ride.png')} style={styles.icon} />
                <Text style={styles.optionText}></Text>
              </TouchableOpacity>

              {/* Delivery Button */}
              <TouchableOpacity 
                style={styles.optionButton} 
                onPress={() => {
                  onSelect('delivery');
                  alert('Delivery selected!'); // Show modal for delivery selection
                }}
              >
                <Image source={require('../../assets/deliver.png')} style={styles.icon} />
                <Text style={styles.optionText}></Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Modal */}
      <LocationModal visible={locationModalVisible} onClose={() => setLocationModalVisible(false)} onSelectLocation={(location) => {
        onSelect('ride', location); // Pass the selected location back
        setLocationModalVisible(false); // Close the LocationModal
      }} />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 400,
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 20,
    alignItems: 'center',
    marginTop: 550,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PopupModal;
