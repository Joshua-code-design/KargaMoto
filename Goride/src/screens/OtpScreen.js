import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, TextInput, Keyboard, Alert } from 'react-native';
import axios from 'axios';

const OtpScreen = ({ navigation, route }) => {
  const { phoneNumber } = route.params; // Get phoneNumber from route params
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  
  // Focus on first input when component mounts
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

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus to next input if current input is filled
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpInteger = parseInt(otp.join(''), 10);
      const response = await axios.post('http://192.168.1.27:5000/api/verify-otp', {
        phone_number: phoneNumber,
        otp: otpInteger
      });

      if (response.status === 200 && response.data.user_type === "passenger") {
      Alert.alert("User Type: ",response.data.user_type);
        //add function to navigate to the passenger screen
      }else if (response.status === 200 && response.data.user_type === "driver") {
        Alert.alert("User Type: ",response.data.user_type);
        //add function to navigate to the driver screen
      }else{
        Alert.alert("Error On Logging In Please try again Later");
      }


    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to verify OTP');
    }
  };


  const handleResendCode = () => {
    // Allow resend when timer is done
    if (timer === 0) {
      // Logic to resend the OTP code
      setOtp(['', '', '', '', '', '']);
      setTimer(30); // Reset timer
    } else {
      Alert.alert('Wait', 'Please wait for the timer to expire before resending the code.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Enter code</Text>
        <Text style={styles.description}>
          We've sent an SMS with an activation code to your phone +91 9318305392.
        </Text>
        
        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
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
          <Text style={styles.resendText}>
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
  resendText: {
    color: '#1E88E5',
    marginTop: 20,
    textAlign: 'center',
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
});

export default OtpScreen;