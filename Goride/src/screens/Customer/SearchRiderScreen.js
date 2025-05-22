import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Modal,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  Animated,
  ActivityIndicator,
  PanResponder,
} from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isLargeScreen = width >= 1024;

const riders = [
  { 
    id: '1', 
    name: 'Jamin Lamis', 
    transaction: '112233445', 
    avatar: require('../../../assets/profile.gif'),
    rating: 4.9,
    distance: '2.1 km',
    eta: '5 min',
    vehicle: 'Honda Click Pro 5g'
  },
  { 
    id: '2', 
    name: 'Chen Bajillo', 
    transaction: '112233446', 
    avatar: require('../../../assets/profile.gif'),
    rating: 4.8,
    distance: '1.8 km',
    eta: '4 min',
    vehicle: 'Yamaha Mio Pro Max'
  },
  { 
    id: '3', 
    name: 'Vernie Danico', 
    transaction: '112233447', 
    avatar: require('../../../assets/profile.gif'),
    rating: 4.7,
    distance: '3.2 km',
    eta: '7 min',
    vehicle: 'Suzuki Raider 11'
  },
  { 
    id: '4', 
    name: 'Joshua Sapalo', 
    transaction: '112233448', 
    avatar: require('../../../assets/profile.gif'),
    rating: 4.9,
    distance: '2.5 km',
    eta: '6 min',
    vehicle: 'Honda Beat Huwawi'
  },
  { 
    id: '5', 
    name: 'Raimund Garcia', 
    transaction: '112233449', 
    avatar: require('../../../assets/Habalaaa.png'),
    rating: 4.6,
    distance: '4.1 km',
    eta: '9 min',
    vehicle: 'Yamaha Sniper 150'
  },
];

export default function App() {
  const [searching, setSearching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pulseAnimation] = useState(new Animated.Value(1));
  const [slideAnimation] = useState(new Animated.Value(height));
  const pan = useRef(new Animated.Value(0)).current;
  
  // For swipe to close gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50 || gestureState.vy > 0.5) {
          closeModal();
        } else {
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Pulse animation for search indicator
    const createPulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (searching) createPulseAnimation();
      });
    };

    createPulseAnimation();

    // Simulate search delay
    const timer = setTimeout(() => {
      setSearching(false);
      openModal();
    }, 3000);

    return () => clearTimeout(timer);
  }, [searching]);

  const openModal = () => {
    setShowModal(true);
    Animated.spring(slideAnimation, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    return stars;
  };

  const renderItem = ({ item, index }) => (
    <Animated.View 
      style={[
        styles.riderItem,
        {
          transform: [{
            translateY: new Animated.Value(50 * (index + 1))
          }]
        }
      ]}
    >
      <View style={styles.riderContent}>
        <View style={styles.avatarContainer}>
          <Image source={item.avatar} style={styles.avatar} />
          <View style={styles.onlineIndicator} />
        </View>
        
        <View style={styles.riderInfo}>
          <View style={styles.riderHeader}>
            <Text style={styles.riderName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              {renderStars(item.rating)}
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          
          <Text style={styles.vehicleText}>{item.vehicle}</Text>
          
          <View style={styles.riderDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{item.distance}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{item.eta}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bookText}>BOOK</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10.6765,
          longitude: 122.9511,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false}
      />

      {searching && (
        <Animated.View 
          style={[
            styles.searchOverlay,
            { transform: [{ scale: pulseAnimation }] }
          ]}
        >
          <View style={styles.searchContent}>
            <ActivityIndicator size="small" color="#667eea" style={styles.loadingIcon} />
            <Text style={styles.searchText}>Finding nearby riders...</Text>
            <TouchableOpacity 
              onPress={() => setSearching(false)}
              style={styles.cancelButton}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {!showModal && !searching && (
        <TouchableOpacity 
          style={styles.openModalButton}
          onPress={openModal}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.openModalGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.openModalText}>Show Available Riders</Text>
            <Ionicons name="chevron-up" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Modal 
        visible={showModal} 
        transparent 
        animationType="none"
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeModal}
          />
          
          <Animated.View 
            style={[
              styles.modalCard,
              { 
                transform: [
                  { translateY: slideAnimation },
                  { translateY: pan }
                ] 
              }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.modalHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Riders</Text>
              <Text style={styles.modalSubtitle}>Choose your preferred rider</Text>
            </View>
            
            <FlatList
              data={riders}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ridersList}
            />
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  map: { 
    ...StyleSheet.absoluteFillObject,
  },
  
  // Search Overlay Styles
  searchOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    backdropFilter: 'blur(10px)',
    minWidth: isTablet ? 400 : width * 0.85,
  },
  searchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: { 
    marginRight: 12,
  },
  searchText: { 
    fontSize: isTablet ? 18 : 16, 
    fontWeight: '600',
    flex: 1,
    color: '#2c3e50',
  },
  cancelButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelText: { 
    fontSize: isTablet ? 16 : 14, 
    color: '#e74c3c',
    fontWeight: '600',
  },

  // Open Modal Button
  openModalButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  openModalGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  openModalText: {
    color: '#fff',
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    marginRight: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: height * 0.75,
    minHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e1e8ed',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: isTablet ? 24 : 20,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: isTablet ? 16 : 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  
  // Rider Item Styles
  ridersList: {
    paddingHorizontal: 20,
  },
  riderItem: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  riderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    borderRadius: isTablet ? 30 : 25,
    backgroundColor: '#e1e8ed',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: '#2ecc71',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  riderInfo: {
    flex: 1,
  },
  riderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  riderName: {
    fontWeight: '600',
    fontSize: isTablet ? 18 : 16,
    color: '#2c3e50',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
    fontWeight: '500',
  },
  vehicleText: {
    fontSize: isTablet ? 14 : 12,
    color: '#95a5a6',
    marginBottom: 8,
  },
  riderDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: isTablet ? 14 : 12,
    color: '#7f8c8d',
    marginLeft: 4,
    fontWeight: '500',
  },
  
  // Book Button Styles
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
    color: '#ffffff',
    fontSize: isTablet ? 14 : 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});