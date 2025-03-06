import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated } from 'react-native';

  // const API_URL = "https://kargamotoapi.onrender.com/api";
const API_URL = "http://192.168.1.27:5000/api";

export const loginUser = async (phoneNumber, showToast, navigation, setLoading) => {
  setLoading(true);

  try {
    const response = await axios.post(`${API_URL}/login`, { phone_number: phoneNumber });

    if (response.status === 200) {
      if (response.data.status === "1") {
        showToast("OTP sent to your mobile number", true);
        setTimeout(() => {
          navigation.navigate("OtpScreen", { phoneNumber });
        }, 2000);
      } else {
        showToast("Welcome! Let's set up your account", true);
        setTimeout(() => {
          navigation.navigate("RegisterScreen", { phoneNumber });
        }, 2000);
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast(error.response?.data?.error || "An error occurred. Please try again.", false);
  } finally {
    setLoading(false);
  }
};



export const verifyOTP = async (phoneNumber, otp, navigation, inputRefs, setInputStatus, showToast) => {
  try {
    const otpInteger = parseInt(otp.join(''), 10);

    //verify otp
    const response = await axios.post(`${API_URL}/verify-otp`, {
      phone_number: phoneNumber,
      otp: otpInteger
    });


    //if status is okay proceed to get user details
    if (response.status === 200) {

      //stores token in async storage
      await AsyncStorage.setItem('token', response.data.token);

      //gets token from async storage
      const token = await AsyncStorage.getItem('token');

      //gets user details from API
      const getUserDetails = await axios.get(`${API_URL}/get-user-details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("User Details Response:", getUserDetails.data);
      if (response.data.user_type === "Passenger") {

        await AsyncStorage.setItem('userDetails', JSON.stringify(getUserDetails.data.user));
        navigation.navigate('LandingPageScreen');
      } else if (response.data.user_type === "Driver") {
        await AsyncStorage.setItem('userDetails', JSON.stringify(getUserDetails.data.user));
      
        await AsyncStorage.setItem('driverDetails', JSON.stringify(getUserDetails.data.driver));

        navigation.navigate('LandingPageScreen');
      } else {
        Alert.alert("Error On Logging In Please try again Later");
      }
    }
  } catch (error) {
    // console.error('Error verifying OTP:', error);
    setInputStatus('error');
    console.error("error is: ", error);
    showToast('Failed to verify OTP');
    
    // Shake animation for wrong OTP
    inputRefs.current.forEach(ref => {
      if (ref) {
        const shake = Animated.sequence([
          Animated.timing(new Animated.Value(0), {
            toValue: 10,
            duration: 50,
            useNativeDriver: true
          }),
          Animated.timing(new Animated.Value(0), {
            toValue: -10,
            duration: 50,
            useNativeDriver: true
          }),
          Animated.timing(new Animated.Value(0), {
            toValue: 10,
            duration: 50,
            useNativeDriver: true
          }),
          Animated.timing(new Animated.Value(0), {
            toValue: 0,
            duration: 50,
            useNativeDriver: true
          })
        ]);
        shake.start();
      }
    });
  }
};

export const logoutUser = async (navigation) => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    if (response.status === 200) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userDetails');
      navigation.navigate('LoginScreen');
    }
  } catch (error) {
    console.error("error is: ", error);
  }
}




