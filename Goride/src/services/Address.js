import axios from "axios";
import * as SecureStore from 'expo-secure-store'; 

  const API_URL = "https://kargamotoapi.onrender.com/api";
  //  const API_URL = "http://192.168.1.56:5000/api";

  export const addFavorites = async (home, work) => {
    try {
        if (!home && !work) {
            console.error("Both home and work locations are missing.");
            return null;
        }

        // Retrieve token from AsyncStorage
        const token = await SecureStore.getItemAsync('token');

        if (!token) {
            console.error("No token found. User might not be authenticated.");
            return null;
        }

        // Construct request payload dynamically
        const payload = {};
        if (home) payload.home = home;
        if (work) payload.work = work;

        // API call to add favorites
        const response = await axios.post(`${API_URL}/add-favorites`, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error adding favorites:", error);
        return null;
    }
};

export const deleteFavorites = async (addressId) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('Authentication required');
  
      const response = await axios.post(`${API_URL}/delete-favorites`, 
        { addressId }, // Sending the ID
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      return response.data;
    } catch (error) {
      console.error('Error deleting address:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  };



export const getFavorites = async () => {
    try {

        // Retrieve token from AsyncStorage
        const token = await SecureStore.getItemAsync('token');

        if (!token) {
            console.error("No token found. User might not be authenticated.");
            return null;
        }
    

        // API call to add favorites
        const response = await axios.get(`${API_URL}/get-favorites`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error adding favorites:", error);
        return null;
    }
};


