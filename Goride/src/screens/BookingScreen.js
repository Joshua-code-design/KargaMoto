import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const BookingConfirmationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Confirmation</Text>
        <View style={{ width: 24 }} />
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationContainer}>
            <View style={styles.locationPoint}>
              <View style={styles.grayCircle}>
                <MaterialIcons name="location-on" size={16} color="#777" />
              </View>
              <Text style={styles.locationText}>SM BACOLOD</Text>
            </View>
            
            <View style={styles.verticalLine} />
            
            <View style={styles.locationPoint}>
              <View style={styles.greenCircle}>
                <MaterialIcons name="location-on" size={16} color="#fff" />
              </View>
              <Text style={styles.locationText}>ROBINSON'S BACOLOD</Text>
              <Text style={styles.destinationText}>Destination Point</Text>
            </View>
          </View>
        </View>
        
        {/* Distance & Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance & Time</Text>
          <View style={styles.rowContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>10 km</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Time of Arrival</Text>
              <Text style={styles.infoValue}>10 minutes</Text>
            </View>
          </View>
        </View>
        
        {/* Payment Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paymentMethod}>
            <View style={styles.grayCircle}>
              <MaterialIcons name="attach-money" size={16} color="#777" />
            </View>
            <Text style={styles.paymentText}>Cash</Text>
          </View>
        </View>
        
        {/* Payment Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentLabel}>Total Payment</Text>
            <Text style={styles.paymentAmount}>1,200.00</Text>
          </View>
        </View>
      </View>
      
      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: '#555',
  },
  locationContainer: {
    paddingHorizontal: 10,
  },
  locationPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  verticalLine: {
    width: 1,
    height: 25,
    backgroundColor: '#ddd',
    marginLeft: 12,
  },
  grayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  greenCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  destinationText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: '#555',
  },
  paymentAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingConfirmationScreen;