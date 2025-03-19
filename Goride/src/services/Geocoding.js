import axios from 'axios';
// services/Geocoding.js
const GOOGLE_MAPS_API_KEY = 'AIzaSyBezmbkcpuSIpDOrFtMkGfsU3u_ZDf7xlg';

// Forward Geocoding: Convert address to coordinates
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Reverse Geocoding: Convert coordinates to address
export const reverseGeocodeCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

export const calculateDistanceAndETA = async (pickup, destination) => {
  // Define origin and destination using latitude and longitude
  const origin = {
    location: {
      latLng: {
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      },
    },
  };

  const dest = {
    location: {
      latLng: {
        latitude: destination.latitude,
        longitude: destination.longitude,
      },
    },
  };

  const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

  const requestBody = {
    origin: origin,
    destination: dest,
    travelMode: 'TWO_WHEELER', // Options: DRIVE, WALK, BICYCLE, TWO_WHEELER, TRANSIT
    routingPreference: 'TRAFFIC_AWARE', // No need for departureTime
    units: 'METRIC', // Use 'METRIC' for kilometers or 'IMPERIAL' for miles
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline', // Request polyline along with distance and duration
      },
    });

    

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return {
        distance: `${(route.distanceMeters / 1000).toFixed(2)} km`, // Convert meters to kilometers
        eta: route.duration, // Duration in seconds
        polyline: route.polyline.encodedPolyline, // Encoded polyline for drawing the route
      };
    } else {
      console.error("Error fetching route:", response.data.error);
      return null;
    }
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return null;
  }
};