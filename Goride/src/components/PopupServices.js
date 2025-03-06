import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const PopupModal = ({ visible, onCancel, onSelect }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Service</Text>
          
          <View style={styles.buttonContainer}>
            {/* Ride Button */}
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => onSelect('ride')}
            >
              <Image source={require('../../assets/ride.png')} style={styles.icon} />
              <Text style={styles.optionText}>Ride</Text>
            </TouchableOpacity>

            {/* Delivery Button */}
            <TouchableOpacity 
              style={styles.optionButton} 
              onPress={() => onSelect('delivery')}
            >
              <Image source={require('../../assets/deliver.png')} style={styles.icon} />
              <Text style={styles.optionText}>Delivery</Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width:400,
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
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 30,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
  },
  closeText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PopupModal;
