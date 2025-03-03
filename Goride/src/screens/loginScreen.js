import React, { useState, useRef } from "react";
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');

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
    setPhoneNumber(text);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://192.168.1.27:5000/api/login", {
        phone_number: phoneNumber,
      });

      if (response.status === 200) {
        navigation.navigate(response.data.status === "1" ? "OtpScreen" : "registerScreen", {
          phoneNumber: phoneNumber,
        });
      }
    } catch (error) {
      console.error("Error submitting phone number:", error);
      alert(error.response?.data?.error || "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Habalaaa.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.heading}>HI NEW USER WELCOME TO KARGAMOTO!!</Text>
      <Text style={styles.footerText}>
      Before we get started, please enter a valid 
      phone number and, if you'd like, your email address.
      </Text>

      <View style={styles.inputContainer}>
        {/* Display Philippines flag and calling code */}
        <View style={styles.countryContainer}>
          <Image source={require("../../assets/flag.jpg")} style={styles.flag} />
          <Text style={styles.callingCode}>+63</Text>
        </View>

        <View style={[styles.numberInputContainer, isFocused && styles.focusedInput]}>
          <Animated.Text style={[styles.floatingLabel, {
            top: animatedLabel.interpolate({ inputRange: [0, 1], outputRange: [12, -10] }),
            fontSize: animatedLabel.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
            color: isFocused ? "#000000" : "#333333",
            fontWeight: isFocused ? "600" : "normal",
          }]}>Mobile Number</Animated.Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10} 
            value={phoneNumber}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            placeholderTextColor="#666666"
          />
        </View>
      </View>

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
    padding: width * 0.05,
    backgroundColor: "#FFFFFF",
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.6,
  },
  heading: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: height * 0.1,
    color: "#000000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 0.05,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.025,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginRight: 10,
    backgroundColor: "#F8F8F8",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  flag: {
    width: width * 0.075,
    height: height * 0.025,
    marginRight: 5,
    borderRadius: 2,
  },
  callingCode: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#000000",
  },
  numberInputContainer: {
    flex: 1,
    position: "relative",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.025,
    backgroundColor: "#FFFFFF",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  focusedInput: {
    borderColor: "black",
    borderWidth: 1.8,
  },
  floatingLabel: {
    position: "absolute",
    left: 10,
    color: "#000000",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    marginTop: 4,
    zIndex: 1,
    letterSpacing: 0.3,
  },
  input: {
    fontSize: width * 0.045,
    fontWeight: "500",
    color: "#000000",
    paddingVertical: 2,
  },
  footerText: {
    fontSize: width * 0.050,
    backgroundColor:'white',
    color: "#555555",
    marginTop: 5,
    lineHeight: width * 0.06,
  },
  button: {
    height: height * 0.07,
    width: "100%",
    backgroundColor: "#0052CC",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 500,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default MobileNumberScreen;