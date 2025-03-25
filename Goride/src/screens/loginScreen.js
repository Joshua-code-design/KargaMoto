import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { loginUser } from "../services/Loginapi"; // Import API function
import styles from "../styles/login";

const Toast = ({ visible, message, success, onHide }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        onHide && onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
      <View style={styles.toastContent}>
        <View style={[styles.iconContainer, success ? styles.successIcon : styles.errorIcon]}>
          <Ionicons name={success ? "checkmark-outline" : "alert-outline"} size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("9307725683");
  const [isFocused, setIsFocused] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", success: true });
  const [loading, setLoading] = useState(false);
  const animatedLabel = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };

  const handleBlur = () => {
    if (!phoneNumber) {
      setIsFocused(false);
      Animated.timing(animatedLabel, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    }
  };

  const handleChangeText = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.startsWith("0")) return;
    setPhoneNumber(numericText);
  };

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    handleSubmit();
  };

  const showToast = (message, success = true) => {
    setToast({ visible: true, message, success });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const validatePhoneNumber = () => {
    if (!phoneNumber) {
      showToast("Please enter your mobile number", false);
      return false;
    }
    if (phoneNumber.length < 10) {
      showToast("Please enter a valid 10-digit mobile number", false);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validatePhoneNumber()) return;
    loginUser(phoneNumber, showToast, navigation, setLoading);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require("../../assets/Habalaaa.png")} style={styles.backgroundImage} resizeMode="cover" />

        <Toast visible={toast.visible} message={toast.message} success={toast.success} onHide={hideToast} />

        <Text style={styles.logoText}>WELCOME!</Text>
        <Text style={styles.footerText}>Before we get started please enter a valid phone number.</Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryContainer}>
            <Image source={require("../../assets/flags.png")} style={styles.flag} />
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

        <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
          <TouchableOpacity style={[styles.button, loading && styles.buttonLoading]} onPress={handleButtonPress} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "On The Way..." : "Continue"}</Text>
            {!loading && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
