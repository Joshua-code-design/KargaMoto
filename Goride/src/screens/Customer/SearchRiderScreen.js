import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SAMPLE_RIDERS = [
  { id: '1', name: 'John Doe', rating: 4.8, rides: 120, vehicle: 'Honda CBR' },
  { id: '2', name: 'Sarah Johnson', rating: 4.9, rides: 205, vehicle: 'Kawasaki Ninja' },
  { id: '3', name: 'Mike Thompson', rating: 4.7, rides: 87, vehicle: 'Yamaha MT-07' },
  { id: '4', name: 'Emily Rodriguez', rating: 4.6, rides: 156, vehicle: 'Ducati Monster' },
  { id: '5', name: 'Alex Chen', rating: 5.0, rides: 312, vehicle: 'BMW S1000RR' },
];

const RiderCard = ({ rider }) => {
  return (
    <TouchableOpacity style={styles.riderCard}>
      <View style={styles.riderAvatarContainer}>
        <Ionicons name="person" size={28} color="#555" />
      </View>
      <View style={styles.riderInfo}>
        <Text style={styles.riderName}>{rider.name}</Text>
        <Text style={styles.vehicleText}>{rider.vehicle}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.statText}>{rider.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="bicycle" size={14} color="#4A90E2" />
            <Text style={styles.statText}>{rider.rides} rides</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Select</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const SearchRiderScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riders, setRiders] = useState(SAMPLE_RIDERS);

  const handleSearch = (text) => {
    setSearchQuery(text);
    // Filter riders based on search query
    if (text) {
      const filteredRiders = SAMPLE_RIDERS.filter(
        rider => rider.name.toLowerCase().includes(text.toLowerCase()) || 
                rider.vehicle.toLowerCase().includes(text.toLowerCase())
      );
      setRiders(filteredRiders);
    } else {
      setRiders(SAMPLE_RIDERS);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Find a Rider</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for riders or motorcycles..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      {/* Motor Icon Banner */}
      <View style={styles.motorBanner}>
        <View style={styles.iconContainer}>
          <Ionicons name="bicycle" size={32} color="#fff" />
        </View>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>Professional Riders</Text>
          <Text style={styles.bannerSubtitle}>Find experienced riders near you</Text>
        </View>
      </View>
      
      {/* Riders List */}
      <FlatList
        data={riders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RiderCard rider={item} />}
        contentContainerStyle={styles.ridersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No riders found</Text>
            <Text style={styles.emptySubtext}>Try different search keywords</Text>
          </View>
        }
      />
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
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    width: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  motorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    marginTop: 2,
  },
  ridersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  riderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  riderAvatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vehicleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
  },
  selectButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
  },
});

export default SearchRiderScreen;