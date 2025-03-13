import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Animated } from 'react-native';

  // const API_URL = "https://kargamotoapi.onrender.com/api";
  const API_URL = "http://192.168.1.33:5000/api";

  export const requestRide = async (pickup, dropoff) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const fare = 1000;

        console.log("pickup:", pickup);
        console.log("dropoff:", dropoff);
        const response = await axios.post(`${API_URL}/book-service`, {
            booking_type: "Ride",
            pickup_location: {
                latitude: pickup.latitude,
                longitude: pickup.longitude,
                address: pickup.address
            },
            dropoff_location: {
                latitude: dropoff.latitude,
                longitude: dropoff.longitude,
                address: dropoff.address
            },
            fare: fare,
            status: "requested"
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error requesting ride:", error);
        return null;
    }
};

