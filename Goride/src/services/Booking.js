import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; 
import { Alert, Animated } from 'react-native';
import { io } from 'socket.io-client';

const API_URL = "http://192.168.1.31:5000/api";
// const API_URL = "https://kargamotoapi.onrender.com/api";

export const acceptBooking = async (bookingId) => {

    try {
        const token = await SecureStore.getItemAsync('token');

        if (!token) {
            console.error("No token found. User might not be authenticated.");
            return null;
        }
        
        const response = await axios.post(`${API_URL}/accept-booking`, {
            booking_id: bookingId,
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