import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  Platform,
  StatusBar,
  Linking,
  Alert
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import {acceptBooking} from '../../services/Booking';

const SOCKET_URL = Constants.expoConfig.extra.socketUrl;

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

// Custom components
const ConnectionStatus = ({ connected, onReconnect }) => (
  <View style={styles.statusCard}>
    <View style={styles.statusContainer}>
      <View style={[styles.statusIndicator, { backgroundColor: connected ? '#4caf50' : '#f44336' }]} />
      <Text style={styles.statusText}>
        {connected ? 'Connected to server' : 'Disconnected from server'}
      </Text>
    </View>
    
    {!connected && (
      <TouchableOpacity 
        style={styles.reconnectButton} 
        onPress={onReconnect}
        activeOpacity={0.7}
      >
        <Text style={styles.reconnectButtonText}>Reconnect</Text>
      </TouchableOpacity>
    )}
  </View>
);

const BookingCard = ({ booking, onPress, onAccept }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'requested': return '#ff9800';
      case 'accepted': return '#4caf50';
      case 'completed': return '#2196f3';
      case 'cancelled': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openMap = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}`
    });
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          "Map Not Available",
          "Could not open the map application",
          [{ text: "OK" }]
        );
      }
    });
  };

  const renderLocation = (location, title) => {
    if (!location) return null;
    
    return (
      <View style={styles.locationContainer}>
        <Text style={styles.locationTitle}>{title}</Text>
        <Text style={styles.locationText}>{location.address}</Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => openMap(location.latitude, location.longitude)}
          activeOpacity={0.7}
        >
          <Text style={styles.mapButtonText}>📍 View on Map</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActionButton = () => {
    if (booking.status !== 'requested') return null;
    
    return (
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => onAccept(booking._id)}
        activeOpacity={0.7}
      >
        <Text style={styles.acceptButtonText}>Accept Booking</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.bookingId}>Booking #{booking._id.slice(-8)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
          <Text style={styles.statusBadgeText}>{booking.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Passenger:</Text>
          <Text style={styles.infoValue}>{booking.passenger_id}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Type:</Text>
          <Text style={styles.infoValue}>{booking.booking_type}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fare:</Text>
          <Text style={styles.fareValue}>${booking.fare?.toFixed(2) || '0.00'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Created:</Text>
          <Text style={styles.infoValue}>{formatDate(booking.created_at)}</Text>
        </View>
      </View>

      <View style={styles.locationsContainer}>
        {renderLocation(booking.pickup_location, "📍 Pickup Location")}
        {renderLocation(booking.dropoff_location, "🏁 Dropoff Location")}
      </View>

      {renderActionButton()}
    </TouchableOpacity>
  );
};

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [socket, setSocket] = useState(null);

  const initializeSocket = () => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
      fetchBookings(newSocket);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('connect_error', (err) => {
      console.log('Connection error:', err.message);
      setLoading(false);
    });

    newSocket.on('requestedBookingsData', (data) => {
      setBookings(sortBookings(data));
      setLoading(false);
      setRefreshing(false);
    });

    newSocket.on('bookingUpdate', (update) => {
      console.log('Received booking update:', update);
      if (update.action === 'created') {
        setBookings(prev => sortBookings([update.booking, ...prev]));
      } else if (update.action === 'status-updated') {
        setBookings(prev => sortBookings(
          prev.map(booking => booking._id === update.booking._id ? update.booking : booking)
        ));
      }
    });

    return newSocket;
  };

  const fetchBookings = (socketInstance) => {
    const socketToUse = socketInstance || socket;
    if (socketToUse && socketToUse.connected) {
      socketToUse.emit('getRequestedBookings');
    }
  };

  const sortBookings = (bookingsArray) => {
    return [...bookingsArray].sort((a, b) => {
      // Sort by status (requested first)
      if (a.status === 'requested' && b.status !== 'requested') return -1;
      if (a.status !== 'requested' && b.status === 'requested') return 1;
      
      // Then sort by date (newest first)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const handleAcceptBooking = async (bookingId) => {
    
    const result = await acceptBooking(bookingId);
    
    if (result?.error) {
        Alert.alert(
            "Error",
            result.error,
            [{ text: "OK" }]
        );
    } else {
        Alert.alert(
            "Success",
            "Booking accepted successfully!",
            [{ text: "OK" }]
        );
        // Refresh bookings after successful acceptance
        fetchBookings();
    }
  };

  useEffect(() => {
    const socket = initializeSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const reconnect = () => {
    if (socket) {
      setLoading(true);
      socket.connect();
    } else {
      const newSocket = initializeSocket();
      setSocket(newSocket);
    }
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [socket]);

  const handleBookingPress = (booking) => {
    Alert.alert(
      `Booking Details: ${booking._id.slice(-8)}`,
      `Status: ${booking.status}\nType: ${booking.booking_type}\nFare: $${booking.fare?.toFixed(2) || '0.00'}`,
      [
        { text: "Close", style: "cancel" },
        booking.status === 'requested' && {
          text: "Accept Booking",
          onPress: () => handleAcceptBooking(booking._id)
        }
      ].filter(Boolean) // Remove falsy values
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🚕 Taxi Bookings</Text>
          <Text style={styles.subtitle}>Real-time monitoring dashboard</Text>
        </View>

        <ConnectionStatus connected={connected} onReconnect={reconnect} />

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285f4" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <BookingCard 
                booking={item} 
                onPress={() => handleBookingPress(item)}
                onAccept={handleAcceptBooking}
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              connected ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No bookings available</Text>
                  <Text style={styles.emptySubtext}>New bookings will appear here automatically</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Not connected to server</Text>
                  <Text style={styles.emptySubtext}>Please check your connection and try again</Text>
                </View>
              )
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={['#4285f4']}
                tintColor="#4285f4"
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    paddingBottom: 0,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: isTablet ? 32 : 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  subtitle: {
    fontSize: isTablet ? 18 : 14,
    color: '#757575',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '500',
    color: '#424242',
  },
  reconnectButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  reconnectButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: isTablet ? 16 : 14,
  },
  listContainer: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  bookingId: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#ff9800',
  },
  statusBadgeText: {
    color: 'white',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: isTablet ? 16 : 14,
    color: '#757575',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: isTablet ? 16 : 14,
    color: '#212121',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  fareValue: {
    fontSize: isTablet ? 16 : 14,
    color: '#4285f4',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  locationsContainer: {
    padding: 16,
    backgroundColor: '#f5f8ff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  locationContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  locationTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 8,
  },
  locationText: {
    fontSize: isTablet ? 15 : 13,
    color: '#424242',
    marginBottom: 8,
  },
  mapButton: {
    backgroundColor: '#f0f4ff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#4285f4',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  acceptButtonText: {
    color: 'white',
    fontSize: isTablet ? 16 : 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: isTablet ? 16 : 14,
    color: '#757575',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: '500',
    color: '#757575',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: isTablet ? 16 : 14,
    color: '#9e9e9e',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});