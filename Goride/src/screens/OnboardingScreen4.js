import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const MobileNumberScreen = ({ countryCode = "PH", callingCode = "+63" }) => {
  const navigation = useNavigation(); // Initialize navigation
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCountryCode, setCountryCode] = useState(countryCode);
  const [selectedCallingCode, setCallingCode] = useState(callingCode);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.1.18:5000/api/login', {
        phone_number: phoneNumber
      });
  
      if (response.status === 200 && response.data.status === "1") {
        // Navigate to Onboarding5 on successful response
        navigation.navigate('Onboarding5');
      } else if (response.status === 200 && response.data.status === "0") {
        navigation.navigate('Onboarding6');
      }
    } catch (error) {
      console.error('Error submitting phone number:', error);
      alert(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  };

  const animatedLabel = useRef(new Animated.Value(phoneNumber ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (phoneNumber === "") {
      setIsFocused(false);
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const formatPhoneNumber = (text) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 10) {
      cleaned = cleaned.slice(0, 10);
    }
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    setPhoneNumber(formatted);
  };

  const labelStyle = {
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -10],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused ? "#2196F3" : "#aaa",
  };

  const handleChangeText = (text) => {
    // Prevent input of '0' as the first character
    if (text.length === 1 && text === '0') {
      return;
    }
    formatPhoneNumber(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hi! What's your mobile number?</Text>
      <Text style={styles.subtext}>
        With a valid number, you can access rides, deliveries, and other services.
      </Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.countryContainer}>
          <CountryPicker
            withFlag
            withCallingCode
            withFilter
            countryCode={selectedCountryCode}
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(`+${country.callingCode[0]}`);
            }}
            onClose={() => {}}
            onOpen={() => {}}
          />
          <Text style={styles.callingCode}>{selectedCallingCode}</Text>
        </TouchableOpacity>

        <View style={styles.numberInputContainer}>
          <Animated.Text style={[styles.floatingLabel, labelStyle]}>
            Mobile Number
          </Animated.Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={12}
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

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
      >
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
    justifyContent: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtext: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
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
    padding: 10,
    borderRadius: 20,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonActive: {
    backgroundColor: "#2196F3",
  },
  buttonDisabled: {
    backgroundColor: "#B0BEC5",
  },
  
  button: {
    height: 56,
    width: '100%',
    backgroundColor: '#0052CC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default MobileNumberScreen;
