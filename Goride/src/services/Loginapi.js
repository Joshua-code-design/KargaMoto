import Constants from 'expo-constants';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store'; 
import { Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

   const API_URL = Constants.expoConfig.extra.serverUrl ;



// In your connection test file (keep the improved version from earlier)
export const testServer = async () => {
  try {
    const response = await axios.get(`${API_URL}/ping`);
    return {
      connected: response.status === 200,
      status: response.status,
      message: 'Connected to backend server'
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        connected: false,
        status: error.response?.status || 0,
        message: error.response 
          ? `Server error: ${error.response.status}`
          : 'No response from server'
      };
    }
    return {
      connected: false,
      status: 0,
      message: 'Connection test failed'
    };
  }
};

export const userDetails = async () => {
  const token = await SecureStore.getItemAsync('token');

  const getUserDetails = await axios.get(`${API_URL}/get-user-details`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return getUserDetails;
};

export const updateUser = async (fullName,gender,phone) => {
  try {
    const token = await SecureStore.getItemAsync('token');

    if (!token) {
      console.error("No token found. User might not be authenticated.");
      return null;
    }

    const response = await axios.post(
      `${API_URL}/update-user-details`,
      {
        full_name: fullName,
        gender: gender,
        phone_number: phone
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};


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

    // Verify OTP
    const response = await axios.post(`${API_URL}/verify-otp`, {
      phone_number: phoneNumber,
      otp: otpInteger
    });

    // If OTP is correct
    if (response.status === 200) {

      // Set input status to success (for green color)
      setInputStatus('success');

      // Show success toast with green color
      showToast('OTP Verified Successfully!', 'success');

      // Store token in AsyncStorage
      await SecureStore.setItemAsync('token', response.data.token);

      // Get token from AsyncStorage
      const token = await SecureStore.getItemAsync('token');

      // Get user details from API
      const getUserDetails = await axios.get(`${API_URL}/get-user-details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("User Details Response:", getUserDetails.data);

      // Delay before navigating to LandingPageScreen
      setTimeout(async () => {
        await AsyncStorage.setItem('userDetails', JSON.stringify(getUserDetails.data.user));

        if (response.data.user_type === "Driver") {
          await AsyncStorage.setItem('driverDetails', JSON.stringify(getUserDetails.data.driver));
          console.log("Driver Login");
          navigation.navigate('LandingPageRider');
        }else if(response.data.user_type === "Passenger"){
          console.log("Passenger Login ");
          navigation.navigate('LandingPageScreen');
        }

       
      }, 1500); // Delay for 1.5 seconds
    }
  } catch (error) {
    setInputStatus('error');
    // console.error("Error is: ", error);
    showToast('Failed to verify OTP', 'error'); // Show error toast

    // Shake animation for incorrect OTP
    inputRefs.current.forEach(ref => {
      if (ref) {
        const shake = Animated.sequence([
          Animated.timing(new Animated.Value(0), { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(new Animated.Value(0), { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(new Animated.Value(0), { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(new Animated.Value(0), { toValue: 0, duration: 50, useNativeDriver: true })
        ]);
        shake.start();
      }
    });
  }
};




export const registerUser = async (fullName,gender) => {
  try {
    const response = await axios.post(`${API_URL}/register-user`, {
      phone_number: phoneNumber,
      gender: gender
    });
    return response;
  } catch (error) {
    throw error;
  }
};




export const logoutUser = async (navigation) => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    if (response.status === 200) {
      await SecureStore.deleteItemAsync('token'); // Changed from AsyncStorage to SecureStore
      await AsyncStorage.clear();
      
      navigation.navigate('LoginScreen');
    }
  } catch (error) {
    console.error("error is: ", error);
  }
}




