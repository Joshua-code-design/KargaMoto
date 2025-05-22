import Constants from 'expo-constants';
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
  Alert,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import {acceptBooking} from '../../services/Booking';

const SOCKET_URL = Constants.expoConfig.extra.socketUrl;

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

// Premium Color Palette
const Colors = {
  primary: '#1a1d29',
  primaryLight: '#2a2f3e',
  accent: '#6366f1',
  accentLight: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#fefefe',
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#94a3b8',
    inverse: '#ffffff'
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8'
  },
  shadow: {
    light: 'rgba(15, 23, 42, 0.08)',
    medium: 'rgba(15, 23, 42, 0.12)',
    dark: 'rgba(15, 23, 42, 0.16)'
  }
};

// Premium Typography
const Typography = {
  h1: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    lineHeight: isTablet ? 40 : 36,
    color: Colors.text.primary
  },
  h2: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '600',
    lineHeight: isTablet ? 32 : 28,
    color: Colors.text.primary
  },
  h3: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    lineHeight: isTablet ? 28 : 24,
    color: Colors.text.primary
  },
  body: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '400',
    lineHeight: isTablet ? 24 : 20,
    color: Colors.text.secondary
  },
  bodyBold: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    lineHeight: isTablet ? 24 : 20,
    color: Colors.text.primary
  },
  caption: {
    fontSize: isTablet ? 14 : 12,
    fontWeight: '500',
    lineHeight: isTablet ? 20 : 16,
    color: Colors.text.tertiary
  },
  button: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    lineHeight: isTablet ? 24 : 20
  }
};

// Custom components
const ConnectionStatus = ({ connected, onReconnect }) => (
  <View style={styles.statusCard}>
    <View style={styles.statusContainer}>
      <View style={[
        styles.statusIndicator, 
        { 
          backgroundColor: connected ? Colors.success : Colors.error,
          shadowColor: connected ? Colors.success : Colors.error,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 4
        }
      ]} />
      <View style={styles.statusTextContainer}>
        <Text style={styles.statusTitle}>
          {connected ? '' : 'Disconnected'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {connected ? '' : 'Attempting to reconnect...'}
        </Text>
      </View>
    </View>
    
    {!connected && (
      <TouchableOpacity 
        style={styles.reconnectButton} 
        onPress={onReconnect}
        activeOpacity={0.8}
      >
        <Text style={styles.reconnectButtonText}>Reconnect</Text>
      </TouchableOpacity>
    )}
  </View>
);

const BookingCard = ({ booking, onPress, onAccept }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'requested': 
        return { 
          color: Colors.warning, 
          bgColor: `${Colors.warning}15`, 
          icon: '⏳' 
        };
      case 'accepted': 
        return { 
          color: Colors.success, 
          bgColor: `${Colors.success}15`, 
          icon: '✅' 
        };
      case 'completed': 
        return { 
          color: Colors.accent, 
          bgColor: `${Colors.accent}15`, 
          icon: '🎉' 
        };
      case 'cancelled': 
        return { 
          color: Colors.error, 
          bgColor: `${Colors.error}15`, 
          icon: '❌' 
        };
      default: 
        return { 
          color: Colors.text.tertiary, 
          bgColor: `${Colors.text.tertiary}15`, 
          icon: '⚪' 
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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

  const renderLocation = (location, title, icon) => {
    if (!location) return null;
    
    return (
      <View style={styles.locationCard}>
        <View style={styles.locationHeader}>
          <Text style={styles.locationIcon}>{icon}</Text>
          <Text style={styles.locationTitle}>{title}</Text>
        </View>
        <Text style={styles.locationAddress} numberOfLines={2}>
          {location.address}
        </Text>
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => openMap(location.latitude, location.longitude)}
          activeOpacity={0.7}
        >
          <Text style={styles.mapButtonText}>View on Map</Text>
          <Text style={styles.mapButtonIcon}>→</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const statusConfig = getStatusConfig(booking.status);

  return (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking</Text>
          <Text style={styles.bookingId}>#{booking._id.slice(-8)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Card Body */}
      <View style={styles.cardContent}>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Passenger</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {booking.passenger_id}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{booking.booking_type}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Fare</Text>
            <Text style={styles.fareValue}>
              ${booking.fare?.toFixed(2) || '0.00'}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.timeValue}>{formatDate(booking.created_at)}</Text>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.locationsSection}>
          {renderLocation(booking.pickup_location, "Pickup Location", "🚀")}
          {renderLocation(booking.dropoff_location, "Destination", "🎯")}
        </View>

        {/* Action Button */}
        {booking.status === 'requested' && (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onAccept(booking._id)}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>Accept Booking</Text>
            <Text style={styles.acceptButtonIcon}>✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function App() {
  const navigation = useNavigation();
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
      if (a.status === 'requested' && b.status !== 'requested') return -1;
      if (a.status !== 'requested' && b.status === 'requested') return 1;
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
      `Booking #${booking._id.slice(-8)}`,
      `Status: ${booking.status}\nType: ${booking.booking_type}\nFare: $${booking.fare?.toFixed(2) || '0.00'}`,
      [
        { text: "Close", style: "cancel" },
        booking.status === 'requested' && {
          text: "Accept Booking",
          onPress: () => handleAcceptBooking(booking._id)
        }
      ].filter(Boolean)
    );
  };

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };
 

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />

      <TouchableOpacity 
        style={styles.arrowContainer} 
        onPress={() => navigation.navigate('LandingPageRider')}
      >
        <Icon name="arrow-left" size={30} color="#26A69A" />
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Customer Bookings</Text>
            <Text style={styles.headerSubtitle}>
              Real-time booking management
            </Text>
          </View>
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>
              {bookings.filter(b => b.status === 'requested').length} pending
            </Text>
          </View>
        </View>

        <ConnectionStatus connected={connected} onReconnect={reconnect} />

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🚕</Text>
                <Text style={styles.emptyTitle}>
                  {connected ? 'No bookings available' : 'Connection lost'}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {connected 
                    ? 'New bookings will appear here automatically' 
                    : 'Please check your connection and try again'
                  }
                </Text>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.accent]}
                tintColor={Colors.accent}
                progressBackgroundColor={Colors.surface}
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
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.h1,
  },
  headerSubtitle: {
    ...Typography.body,
    marginTop: 4,
  },
  headerStats: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statsText: {
    ...Typography.caption,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  
  // Status Card Styles
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    ...Typography.bodyBold,
    marginBottom: 2,
  },
  statusSubtitle: {
    ...Typography.caption,
  },
  reconnectButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  reconnectButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
  },
  
  // List Styles
  listContainer: {
    paddingBottom: 32,
  },
  separator: {
    height: 16,
  },
  
  // Booking Card Styles
  bookingCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  bookingIdContainer: {
    flex: 1,
  },
  bookingIdLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  bookingId: {
    ...Typography.h3,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginLeft: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 20,
  },
  
  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 16,
    paddingRight: 8,
  },
  infoLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  infoValue: {
    ...Typography.bodyBold,
  },
  fareValue: {
    ...Typography.bodyBold,
    color: Colors.accent,
    fontSize: isTablet ? 18 : 16,
  },
  timeValue: {
    ...Typography.bodyBold,
    color: Colors.success,
  },
  
  // Locations Section
  locationsSection: {
    marginBottom: 20,
  },
  locationCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationTitle: {
    ...Typography.bodyBold,
    color: Colors.accent,
  },
  locationAddress: {
    ...Typography.body,
    marginBottom: 12,
    lineHeight: 20,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  mapButtonText: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '600',
  },
  mapButtonIcon: {
    ...Typography.caption,
    color: Colors.accent,
    fontWeight: '600',
  },
  
  // Accept Button
  acceptButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifycontent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptButtonText: {
    ...Typography.button,
    color: Colors.text.inverse,
    marginRight: 8,
  },
  acceptButtonIcon: {
    fontSize: 16,
    color: Colors.text.inverse,
  },
  
  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    textAlign: 'center',
    lineHeight: 24,
  },
});