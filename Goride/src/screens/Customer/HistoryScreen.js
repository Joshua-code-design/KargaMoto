import React from 'react';
import { View, Text, SafeAreaView,FlatList, StatusBar, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import styles from '../../styles/history'

const { width, height } = Dimensions.get('window');

const HistoryScreen = () => {
  const bookingHistory = [
    { id: '1', title: 'Downtown Express', date: '2023-10-01', status: 'Completed', pickupLocation: 'Main Street', dropoffLocation: 'City Center', icon: 'business' },
    { id: '2', title: 'Airport Transfer', date: '2023-10-02', status: 'Completed', pickupLocation: 'Home', dropoffLocation: 'International Airport', icon: 'airplane' },
    { id: '3', title: 'Family Visit', date: '2023-10-03', status: 'Cancelled', pickupLocation: 'City Center', dropoffLocation: 'Suburbs', icon: 'home' },
  ];

  const renderItem = ({ item }) => {
    const statusColor = item.status === 'Completed' ? '#4CAF50' : '#FF5722';
    
    return (
      <TouchableOpacity style={styles.historyItem} activeOpacity={0.7}>
        <View style={styles.itemLeftContent}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={statusColor} 
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.historyTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>
                <Ionicons name="location-outline" size={12} color="#757575" /> 
                {item.pickupLocation} → {item.dropoffLocation}
              </Text>
            </View>
            <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Text style={[styles.historyStatus, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      <ImageBackground
        source={require('../../../assets/history.png')} // Modern, subtle background
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Booking History</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={24} color="#212121" />
            </TouchableOpacity>
          </View>
          
          {bookingHistory.length > 0 ? (
            <FlatList
              data={bookingHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="document-text-outline" size={64} color="#E0E0E0" />
                  <Text style={styles.emptyText}>No booking history found</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyText}>No booking history found</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};


export default HistoryScreen;