import axios from "axios";
import { Alert } from "react-native";

const handleSubmit = async (mobileNumber, navigation) => {
    const formattedNumber = mobileNumber.replace(/-/g, "");
    if (formattedNumber.length !== 12 || !formattedNumber.startsWith('0')) { // Updated length check to 12 and starting digit to 0
        Alert.alert("Invalid Number", "Please enter a valid 12-digit mobile number starting with 0."); // Updated message to reflect new length
        return;
    }

    try {
        const response = await axios.post("http://192.168.1.18:5000/api/submit", { // Changed endpoint to /submit
            phone_number: formattedNumber,
        });

        if (response.status === 200) {
            if (response.data.status === "success") { // Updated status check to "success"
                Alert.alert("Success", "Phone number saved. Proceeding to OTP...");
                navigation.navigate('OtpScreen');
            } else {
                Alert.alert("Error", "Failed to save phone number. Please try again.");
            }
        }
    } catch (error) {
        console.error("Error submitting phone number:", error);
        Alert.alert("Error", error.response?.data?.error || "An error occurred. Please try again.");
    }
};
