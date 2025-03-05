import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8, // Smaller height
    paddingHorizontal: 12, // Adjusted width
    borderRadius: 25, // Modern curved edges
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120, // Ensures button is not too small
  },
  buttonText: {
    color: "#fff",
    fontSize: 14, // Slightly smaller text
    fontWeight: "600", // Medium-bold for a modern look
  },
});

export default ModernButton;