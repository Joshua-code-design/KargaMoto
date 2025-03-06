import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { verifyOTP } from '../services/Loginapi';
import styles from '../styles/otp';


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


export default OtpScreen;