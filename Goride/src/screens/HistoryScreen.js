import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, StatusBar, ImageBackground } from 'react-native';

const HistoryScreen = () => {
  const bookingHistory = [
    { id: '1', title: 'Booking to Downtown', date: '2023-10-01', status: 'Completed' },
    { id: '2', title: 'Booking to Airport', date: '2023-10-02', status: 'Completed' },
    { id: '3', title: 'Booking to Grandma\'s', date: '2023-10-03', status: 'Cancelled' },
  ];

  const renderItem = ({ item }) => {
    const statusColor = item.status === 'Completed' ? '#4CAF50' : '#F44336';
    
    return (
      <View style={styles.historyItem}>
        <View style={styles.contentContainer}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Text style={[styles.historyStatus, { color: statusColor }]}>{item.status}</Text>
        </View>
      </View>
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground 
        source={require('../../assets/history.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Booking History</Text>
          </View>
          
          {bookingHistory.length > 0 ? (
            <FlatList
              data={bookingHistory}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No booking history found</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingVertical: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#757575',
  },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default HistoryScreen;