import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://kargamotoapi.onrender.com/api";

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
          navigation.navigate("registerScreen", { phoneNumber });
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

export const handleVerifyOTP = async (otp, phoneNumber, showToast, navigation, setInputStatus) => {
  try {
    const otpInteger = parseInt(otp.join(""), 10);
    const response = await axios.post(`${API_URL}/verify-otp`, {
      phone_number: phoneNumber,
      otp: otpInteger,
    });

    if (response.status === 200) {
      await AsyncStorage.setItem("token", response.data.token);

      setInputStatus("success");
      showToast("OTP verified successfully!");

      setTimeout(() => {
        if (response.data.user_type === "passenger" || response.data.user_type === "driver") {
          navigation.navigate("LandingPageScreen");
        }
      }, 1500);
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    setInputStatus("error");
    showToast(error.response?.data?.error || "Failed to verify OTP", "error");
  }
};