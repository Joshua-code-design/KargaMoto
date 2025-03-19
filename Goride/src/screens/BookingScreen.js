import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Image,
  PixelRatio
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { calculateDistanceAndETA } from '../services/Geocoding';

// Get device dimensions and pixel ratio for true responsiveness
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const pixelRatio = PixelRatio.get();

// Normalize based on screen size and pixel density
const widthPercentageToDP = (widthPercent) => {
  const screenWidth = SCREEN_WIDTH;
  return PixelRatio.roundToNearestPixel((screenWidth * parseFloat(widthPercent)) / 100);
};

const heightPercentageToDP = (heightPercent) => {
  const screenHeight = SCREEN_HEIGHT;
  return PixelRatio.roundToNearestPixel((screenHeight * parseFloat(heightPercent)) / 100);
};

// Normalize font size based on screen size
const normalize = (size) => {
  const scale = SCREEN_WIDTH / 375; // Based on iPhone 8 width
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const BookingConfirmationScreen = ({ navigation }) => {
  const route = useRoute();
  const { serviceType, pickup, destination } = route.params || {};
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const [mapUrl, setMapUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Extract location details
  const pickupAddress = pickup?.address || "Unknown Pickup Location";
  const destinationAddress = destination?.address || "Unknown Destination";
  
  // Generate static map URL
  const generateMapUrl = useCallback(() => {
    if (!pickup || !destination) return null;
    
    // Using Google Static Maps API
    // Note: In a real app, you'd want to hide your API key using environment variables
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
    
    // Set map center to midpoint between pickup and destination
    const midLat = (pickup.latitude + destination.latitude) / 2;
    const midLng = (pickup.longitude + destination.longitude) / 2;
    
    // Calculate zoom level based on distance
    let zoomLevel = 13;
    if (distance) {
      const distanceValue = parseFloat(distance);
      if (distanceValue < 1) zoomLevel = 15;
      else if (distanceValue < 3) zoomLevel = 14;
      else if (distanceValue < 10) zoomLevel = 12;
      else zoomLevel = 11;
    }
    
    // Create map URL
    let url = `https://maps.googleapis.com/maps/api/staticmap?`;
    url += `center=${midLat},${midLng}`;
    url += `&zoom=${zoomLevel}`;
    url += `&size=600x300`;
    url += `&maptype=roadmap`;
    
    // Add markers
    url += `&markers=color:green|label:A|${pickup.latitude},${pickup.longitude}`;
    url += `&markers=color:red|label:B|${destination.latitude},${destination.longitude}`;
    
    // Add path
    url += `&path=color:0x4CAF50CC|weight:5|${pickup.latitude},${pickup.longitude}|${destination.latitude},${destination.longitude}`;
    
    // Add key
    url += `&key=${apiKey}`;
    
    return url;
  }, [pickup, destination, distance]);
  
  const fetchAndAlertDistance = async () => {
    try {
      setLoading(true);
      // Call the calculateDistanceAndETA function
      const result = await calculateDistanceAndETA(pickup, destination);
      console.log("API Response:", result);
  
      if (result) {
        const formatDuration = (duration) => {
          // Extract numeric value from duration string (e.g., "933s" -> 933)
          const seconds = typeof duration === 'string' ? parseFloat(duration) : duration;
  
          if (isNaN(seconds)) {
            console.error("Invalid duration value:", duration);
            return "N/A";
          }
  
          // Convert seconds to minutes
          const minutes = Math.floor(seconds / 60);
          return `${minutes} minutes`;
        };
  
        const formattedETA = formatDuration(result.eta);
        console.log("Formatted ETA:", formattedETA);
  
        // Update state or display the result
        setDistance(result.distance);
        setDuration(formattedETA);
        
        // Generate map URL
        const url = generateMapUrl();
        setMapUrl(url);
      } else {
        Alert.alert("Error", "Failed to fetch distance data.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchAndAlertDistance:", error);
      Alert.alert("Error", "An error occurred while fetching distance data.");
      setLoading(false);
    }
  };

  const fareCalculation = () => {
    // Calculate fare based on distance  
    const baseFare = 50;
    const farePerKm = 10;
    const baseKilometer = 2;
    
    console.log("Distance in fareCalculation:", distance);
    
    const distanceInKm = parseFloat(distance);
    
    if (isNaN(distanceInKm)) {  
      console.error("Invalid distance value:", distance);
      return "N/A";
    }
    
    if (distanceInKm <= baseKilometer) {
      setFare(baseFare);
    } else {
      const extraDistance = distanceInKm - baseKilometer;
      const totalPayment = baseFare + (extraDistance * farePerKm);
      setFare(Math.round(totalPayment));
    }
  };
  
  // Show alert when screen loads
  useEffect(() => {
    fetchAndAlertDistance();
  }, []);
  
  useEffect(() => {
    if (distance !== null) {
      fareCalculation();
    }
  }, [distance]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? "dark-content" : "light-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={normalize(22)} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmation</Text>
        <View style={{ width: normalize(22) }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map View */}
        <View style={styles.mapContainer}>
          {mapUrl ? (
            <Image 
              source={{ uri: mapUrl }}
              style={styles.mapImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={normalize(40)} color="#cccccc" />
              <Text style={styles.mapPlaceholderText}>Loading map...</Text>
            </View>
          )}
          <View style={styles.mapOverlay}>
            <View style={styles.routeInfoContainer}>
              <Text style={styles.routeDistanceText}>{distance || "Calculating..."}</Text>
              <Text style={styles.routeDurationText}>{duration || "Calculating..."}</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.locationContainer}>
            {/* Pickup */}
            <View style={styles.locationPoint}>
              <View style={styles.grayCircle}>
                <MaterialIcons name="location-on" size={normalize(16)} color="#555" />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationText} numberOfLines={2}>{pickupAddress}</Text>
              </View>
            </View>

            <View style={styles.verticalLine} />

            {/* Destination */}
            <View style={styles.locationPoint}>
              <View style={styles.greenCircle}>
                <MaterialIcons name="location-on" size={normalize(16)} color="#fff" />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Drop-off</Text>
                <Text style={styles.locationText} numberOfLines={2}>{destinationAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.serviceDetailsContainer}>
            <View style={styles.serviceDetailItem}>
              <View style={styles.serviceDetailIcon}>
                <FontAwesome5 name="road" size={normalize(14)} color="#333" />
              </View>
              <View>
                <Text style={styles.serviceDetailLabel}>Distance</Text>
                <Text style={styles.serviceDetailValue}>{distance}</Text>
              </View>
            </View>
            
            
            <View style={styles.serviceDetailItem}>
              <View style={styles.serviceDetailIcon}>
                <MaterialIcons name="access-time" size={normalize(16)} color="#333" />
              </View>
              <View>
                <Text style={styles.serviceDetailLabel}>Time of Arrival</Text>
                <Text style={styles.serviceDetailValue}>{duration}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Change</Text>
              <MaterialIcons name="keyboard-arrow-right" size={normalize(16)} color="#4CAF50" />
            </TouchableOpacity>
          </View>
          <View style={styles.paymentMethod}>
            <View style={styles.paymentIcon}>
              <MaterialIcons name="attach-money" size={normalize(16)} color="#555" />
            </View>
            <Text style={styles.paymentText}>Cash</Text>
          </View>
        </View>

        {/* Payment Details Section */}
        <View style={[styles.section, styles.paymentSection]}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Base fare</Text>
            <Text style={styles.paymentValue}>₱ 50.00</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Distance cost</Text>
            <Text style={styles.paymentValue}>₱ {fare > 50 ? (fare - 50).toFixed(2) : '0.00'}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalAmount}>₱ {fare ? fare.toFixed(2) : '0.00'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.fareContainer}>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareAmount}>₱ {fare ? fare.toFixed(2) : '0.00'}</Text>
          </View>
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: widthPercentageToDP('5%'),
    paddingVertical: heightPercentageToDP('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backButton: {
    marginTop: widthPercentageToDP('10%'),
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#333333',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: heightPercentageToDP('30%'),
    backgroundColor: '#e0e0e0',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholderText: {
    marginTop: heightPercentageToDP('1%'),
    color: '#999999',
    fontSize: normalize(14),
  },
  mapOverlay: {
    position: 'absolute',
    bottom: heightPercentageToDP('2%'),
    right: widthPercentageToDP('5%'),
  },
  routeInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: widthPercentageToDP('2%'),
    paddingHorizontal: widthPercentageToDP('4%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  routeDistanceText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#333333',
  },
  routeDurationText: {
    fontSize: normalize(12),
    color: '#666666',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: widthPercentageToDP('5%'),
    marginHorizontal: widthPercentageToDP('5%'),
    marginTop: heightPercentageToDP('2%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: '600',
    marginBottom: heightPercentageToDP('1.5%'),
    color: '#333333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPercentageToDP('1.5%'),
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: normalize(14),
    color: '#4CAF50',
    fontWeight: '500',
  },
  locationContainer: {
    paddingHorizontal: widthPercentageToDP('1%'),
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: heightPercentageToDP('1%'),
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: normalize(12),
    color: '#888888',
    marginBottom: 2,
  },
  verticalLine: {
    width: 1,
    height: heightPercentageToDP('3%'),
    backgroundColor: '#dddddd',
    marginLeft: widthPercentageToDP('3.2%'),
  },
  grayCircle: {
    width: widthPercentageToDP('6.5%'),
    height: widthPercentageToDP('6.5%'),
    borderRadius: widthPercentageToDP('3.25%'),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPercentageToDP('3%'),
  },
  greenCircle: {
    width: widthPercentageToDP('6.5%'),
    height: widthPercentageToDP('6.5%'),
    borderRadius: widthPercentageToDP('3.25%'),
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPercentageToDP('3%'),
  },
  locationText: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#333333',
    flexShrink: 1,
  },
  serviceDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  serviceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginBottom: heightPercentageToDP('1.5%'),
  },
  serviceDetailIcon: {
    width: widthPercentageToDP('8%'),
    height: widthPercentageToDP('8%'),
    borderRadius: widthPercentageToDP('4%'),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPercentageToDP('3%'),
  },
  serviceDetailLabel: {
    fontSize: normalize(12),
    color: '#888888',
    marginBottom: 2,
  },
  serviceDetailValue: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#333333',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: widthPercentageToDP('8%'),
    height: widthPercentageToDP('8%'),
    borderRadius: widthPercentageToDP('4%'),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: widthPercentageToDP('3%'),
  },
  paymentText: {
    fontSize: normalize(15),
    fontWeight: '500',
    color: '#333333',
  },
  paymentSection: {
    marginBottom: heightPercentageToDP('10%'),
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPercentageToDP('1%'),
  },
  paymentLabel: {
    fontSize: normalize(14),
    color: '#666666',
  },
  paymentValue: {
    fontSize: normalize(14),
    fontWeight: '500',
    color: '#333333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: heightPercentageToDP('1.5%'),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: normalize(15),
    fontWeight: '500',
    color: '#333333',
  },
  totalAmount: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#4CAF50',
  },
  bottomContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#ffffff',
    paddingVertical: heightPercentageToDP('2%'),
    paddingHorizontal: widthPercentageToDP('5%'),
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareContainer: {
    flex: 1,
  },
  fareLabel: {
    fontSize: normalize(12),
    color: '#888888',
  },
  fareAmount: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#333333',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: heightPercentageToDP('1.8%'),
    paddingHorizontal: widthPercentageToDP('5%'),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: normalize(16),
    fontWeight: '600',
  },
});

export default BookingConfirmationScreen;