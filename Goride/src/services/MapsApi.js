import Constants from 'expo-constants';
import axios from "axios";
import * as SecureStore from 'expo-secure-store'; 
import { Alert, Animated } from 'react-native';
import { io } from 'socket.io-client';


const API_URL = Constants.expoConfig.extra.serverUrl ;



const SOCKET_URL = Constants.expoConfig.extra.socketUrl;

const socket = io(`${SOCKET_URL}`, {
  transports: ['websocket']
});
  
  export const requestRide = async (pickup, destination, serviceType, fare,convertedDistance,convertedDuration,GooglePolyline) => {
      try {
          const token = await SecureStore.getItemAsync('token');
  
          const response = await axios.post(`${API_URL}/book-service`, {
              booking_type: serviceType,
              pickup_location: {
                  latitude: pickup.latitude,
                  longitude: pickup.longitude,
                  address: pickup.address
              },
              dropoff_location: {
                  latitude: destination.latitude,
                  longitude: destination.longitude,
                  address: destination.address
              },
              fare: fare,
              distance: convertedDistance,
              duration: convertedDuration,
              status: "requested",
              polyline: GooglePolyline,
          }, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
  
          // Emit socket event after successful booking
          if (response.data && response.data._id) {
              socket.emit('newBooking', response.data);
          }
  
          return response.data;
  
      } catch (error) {
          console.error("Error requesting ride:", error);
          return null;
      }
  };

export const addFavorites = async (home, work) => {
    try {
        const token = await SecureStore.getItemAsync('token');

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






