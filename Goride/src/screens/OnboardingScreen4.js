import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const MobileNumberScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const animatedLabel = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!phoneNumber) {
      setIsFocused(false);
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleChangeText = (text) => {
    if (text.startsWith("0")) return;
    setPhoneNumber(text.replace(/\D/g, "").slice(0, 10));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://192.168.1.18:5000/api/login", {
        phone_number: phoneNumber,
      });

      if (response.status === 200) {
        navigation.navigate(response.data.status === "1" ? "Onboarding5" : "Onboarding6");
      }
    } catch (error) {
      console.error("Error submitting phone number:", error);
      alert(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi! What's your mobile number?</Text>

      <View style={styles.inputContainer}>
        {/* Display Philippines flag and calling code */}
        <View style={styles.countryContainer}>
          <Image source={require("../../assets/flag.jpg")} style={styles.flag} />
          <Text style={styles.callingCode}>+63</Text>
        </View>

        <View style={styles.numberInputContainer}>
          <Animated.Text style={[styles.floatingLabel, {
            top: animatedLabel.interpolate({ inputRange: [0, 1], outputRange: [12, -10] }),
            fontSize: animatedLabel.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
            color: isFocused ? "#2196F3" : "#aaa",
          }]}>Mobile Number</Animated.Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
          />
        </View>
      </View>

      <Text style={styles.footerText}>
        We also use your number to allow bikers and customer service to contact you about your bookings.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
    marginTop: 20,
  },
  flag: {
    width: 30,
    height: 17,
    marginRight: 5,
  },
  callingCode: {
    fontSize: 20,
    fontWeight: "bold",
  },
  numberInputContainer: {
    flex: 1,
    position: "relative",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 1,
    borderRadius: 20,
    marginTop: 20,
  },
  floatingLabel: {
    position: "absolute",
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 5,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 12,
    color: "gray",
    marginTop: 10,
  },
  button: {
    height: 56,
    width: "100%",
    backgroundColor: "#0052CC",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default MobileNumberScreen;
