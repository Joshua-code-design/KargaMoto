import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Animated } from 'react-native';

  // const API_URL = "https://kargamotoapi.onrender.com/api";
  const API_URL = "http://192.168.1.27:5000/api";

export const requestRide = async (latitude, longitude,address) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/request-ride`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching location:", error);
        return null;
    }
};
