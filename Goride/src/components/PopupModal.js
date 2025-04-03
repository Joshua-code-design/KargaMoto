import React from "react";
import { Modal, View, Text, TouchableOpacity, } from "react-native";
import styles from '../styles/popupModal.js'; 

const PopupModal = ({ visible, title, message, onCancel, onConfirm }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


export default PopupModal;