import React from "react";
import { TouchableOpacity, Text, } from "react-native";
import styles from '../../styles/modernButton.js'; 


const ModernButton = ({ title, onPress, color = "#007bff" }) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};


export default ModernButton;