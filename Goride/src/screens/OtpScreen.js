import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, TextInput, Keyboard, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { verifyOTP } from '../services/Loginapi';


// Toast Component
const Toast = ({ visible, message, type, onHide }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        onHide && onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.toastContainer, 
        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0]
        })}] 
      }]}
    >
      <View style={styles.toastContent}>
        {type === 'success' && (
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          </View>
        )}
        {type === 'error' && (
          <View style={styles.iconContainer}>
            <Ionicons name="close-circle" size={24} color="#F44336" />
          </View>
        )}
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const OtpScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [inputStatus, setInputStatus] = useState('default'); // 'default', 'success', 'error'
  const inputRefs = useRef([]);
  
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, []);

  // Reset input status if user modifies the OTP after validation
  useEffect(() => {
    if (inputStatus !== 'default') {
      setInputStatus('default');
    }
  }, [otp]);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = () => {
    verifyOTP(phoneNumber, otp, navigation, inputRefs, setInputStatus, showToast);
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setOtp(['', '', '', '', '', '']);
      setTimer(30);
      setInputStatus('default');
      showToast('Verification code resent');
      // Add API call to resend OTP here
      
      // Focus on first input after resend
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } else {
      showToast(`Please wait ${timer} seconds before resending`, 'error');
    }
  };

  // Function to get the proper box style based on current input status
  const getInputBoxStyle = () => {
    switch (inputStatus) {
      case 'success':
        return styles.otpBoxSuccess;
      case 'error':
        return styles.otpBoxError;
      default:
        return styles.otpBox;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Toast 
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={hideToast}
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.description}>
          We've sent an SMS with an activation code to your phone
        </Text>
        
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[getInputBoxStyle()]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={value => handleOtpChange(value, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleResendCode} disabled={timer > 0}>
          <Text style={[styles.resendText, timer > 0 && styles.disabledText]}>
            {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleVerifyOTP}
          activeOpacity={0.7} 
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: '80%',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  otpBox: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 6,
    backgroundColor: 'white',
    color: '#000',
  },
  otpBoxSuccess: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    color: '#4CAF50',
  },
  otpBoxError: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    marginHorizontal: 6,
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
    color: '#F44336',
  },
  resendText: {
    color: '#1E88E5',
    marginTop: 20,
    textAlign: 'center',
  },
  disabledText: {
    color: '#9E9E9E',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
  },
  nextButton: {
    backgroundColor: '#1E88E5',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Toast styles
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: '80%',
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 12,
  },
  toastMessage: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  }
});

export default OtpScreen;