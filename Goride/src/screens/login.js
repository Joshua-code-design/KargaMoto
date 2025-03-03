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
        navigation.navigate(response.data.status === "1" ? "OtpScreen" : "register", {
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
    padding: width * 0.05,
  },
  heading: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: height * 0.1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.025,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
    marginTop: 20,
  },
  flag: {
    width: width * 0.075,
    height: height * 0.025,
    marginRight: 5,
  },
  callingCode: {
    fontSize: width * 0.05,
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
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: width * 0.05,
    color: "gray",
    marginTop: 5,
    alignItems: "left",
  },
  button: {
    height: height * 0.07,
    width: "100%",
    backgroundColor: "#0052CC",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: height * 0.1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default MobileNumberScreen;