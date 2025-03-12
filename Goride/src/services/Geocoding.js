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