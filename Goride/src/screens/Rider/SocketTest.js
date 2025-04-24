import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button, Linking } from 'react-native';
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.1.13:5000';

export default function App() {
  const [bookings, setBookings] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
      newSocket.emit('getRequestedBookings');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('connect_error', (err) => {
      console.log('Connection error:', err.message);
    });

    newSocket.on('requestedBookingsData', (data) => {
      setBookings(data);
      setLoading(false);
    });

    newSocket.on('bookingUpdate', (update) => {
      console.log('Received booking update:', update);
      if (update.action === 'created') {
        setBookings(prev => [update.booking, ...prev]);
      } else if (update.action === 'status-updated') {
        setBookings(prev => prev.map(booking => 
          booking._id === update.booking._id ? update.booking : booking
        ));
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  const renderLocation = (location, title) => {
    if (!location) return null;
    
    return (
      <View style={styles.locationContainer}>
        <Text style={styles.locationTitle}>{title}</Text>
        <Text style={styles.locationText}>Address: {location.address}</Text>
        <View style={styles.coordinatesContainer}>
          <Text style={styles.locationText}>
            Lat: {location.latitude?.toFixed(6)}
          </Text>
          <Text style={[styles.locationText, { marginLeft: 10 }]}>
            Long: {location.longitude?.toFixed(6)}
          </Text>
        </View>
      
      </View>
    );
  };

  const renderBooking = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.header}>Booking ID: {item._id}</Text>
      <Text style={[
        styles.statusText,
        { color: item.status === 'requested' ? '#e67e22' : '#2ecc71' }
      ]}>
        Status: {item.status}
      </Text>
      <Text>Passenger: {item.passenger_id}</Text>
      <Text>Type: {item.booking_type}</Text>
      <Text>Fare: ${item.fare?.toFixed(2)}</Text>
      <Text>Created: {new Date(item.created_at).toLocaleString()}</Text>
      
      {renderLocation(item.pickup_location, "Pickup Location")}
      {renderLocation(item.dropoff_location, "Dropoff Location")}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚕 Requested Bookings</Text>
      
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: connected ? 'green' : 'red' }]} />
        <Text style={styles.statusText}>
          {connected ? 'Connected to server' : 'Disconnected from server'}
        </Text>
      </View>

      {!connected && (
        <Button title="Reconnect" onPress={reconnect} color="#4285f4" />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#4285f4" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No bookings available</Text>
          }
          refreshing={loading}
          onRefresh={() => {
            setLoading(true);
            socket.emit('getRequestedBookings');
          }}
        />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
    color: '#2c3e50',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  locationContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  locationTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4285f4',
  },
  locationText: {
    fontSize: 14,
    color: '#555',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
});