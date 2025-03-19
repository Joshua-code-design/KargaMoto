import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Animated } from 'react-native';

  // const API_URL = "https://kargamotoapi.onrender.com/api";
  const API_URL = "http://192.168.1.30:5000/api";

  export const requestRide = async (pickup, dropoff,service) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const fare = 1000;

        // console.log("pickup:", pickup);
        // console.log("dropoff:", dropoff);
        // console.log("serviceType:", ServiceType);

        const response = await axios.post(`${API_URL}/book-service`, {
            booking_type: service,
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


export const addFavorites = async (home, work) => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            console.warn("No authentication token found.");
            return null;
        }

        if (!home && !work) {
            console.warn("Both home and work locations are missing.");
            return null;
        }

        if (home && (!home.latitude || !home.longitude || !home.address)) {
            alert("Home location fields are missing (latitude, longitude, or address).");
            return null;
        }

        if (work && (!work.latitude || !work.longitude || !work.address)) {
            alert("Work location fields are missing (latitude, longitude, or address).");
            return null;
        }

        const response = await axios.post(
            `${API_URL}/add-favorites`, 
            { home, work }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;
    } catch (error) {
        console.error("Error adding favorites:", error?.response?.data || error.message);
        alert("Failed to add favorites. Please try again.");
        return null;
    }
};


export const calculateDistance = async (pickup, destination) => {

};




