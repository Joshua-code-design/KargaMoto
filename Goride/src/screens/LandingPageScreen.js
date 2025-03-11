
import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Dimensions, 
  Platform, 
  Animated 
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedElement } from 'react-navigation-shared-element';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const isSmallDevice = windowWidth < 375;
  const isTablet = windowWidth > 768;
  
  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  
  // Responsive size calculations
  const fontSize = {
    small: isSmallDevice ? 12 : (isTablet ? 16 : 14),
    medium: isSmallDevice ? 14 : (isTablet ? 20 : 16),
    large: isSmallDevice ? 18 : (isTablet ? 28 : 22),
    xlarge: isSmallDevice ? 24 : (isTablet ? 36 : 30),
  };
  
  const spacing = {
    xs: isSmallDevice ? 4 : (isTablet ? 12 : 8),
    small: isSmallDevice ? 8 : (isTablet ? 16 : 12),
    medium: isSmallDevice ? 12 : (isTablet ? 24 : 16),
    large: isSmallDevice ? 16 : (isTablet ? 32 : 24),
  };

  // Modern carousel images with better quality
  const carouselItems = [
    { 
      uri: 'https://www.apurple.co/wp-content/uploads/2023/01/Book-A-Ride.jpg',
      title: 'Quick Ride',
      description: 'Get to your destination faster'
    },
    { 
      uri: 'https://jontotheworld.com/wp-content/uploads/2014/12/habal-habal.jpg',
      title: 'Safe Travel',
      description: 'Professional drivers at your service'
    },
    { 
      uri: 'https://www.apurple.co/wp-content/uploads/2023/01/Book-A-Ride.jpg',
      title: 'Special Offers',
      description: 'Enjoy exclusive discounts today'
    },
  ];

  // Recent destinations with icons
  const recentDestinations = [
    { name: 'Home', icon: 'home' },
    { name: 'Office', icon: 'briefcase' },
    { name: 'Sandoval St.', icon: 'map-marker' },
    { name: 'Lincoln St.', icon: 'map-marker' },
    { name: 'Ayala Mall', icon: 'shopping' }
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return '₱ ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Animate elements on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [90, 70],
    extrapolate: 'clamp',
  });

  // Animation for touchable feedback
  const animateTouchable = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Navigation with transition
  const navigateTo = (screen) => {
    animateTouchable();
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000"
        translucent
      />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: headerOpacity,
            height: headerHeight,
          }
        ]}
      >
        <LinearGradient
          colors={['#1A1A1A', '#121212']}
          style={styles.headerGradient}
        >
          <View style={styles.headerLogo}>
            <MaterialCommunityIcons name="motorbike" size={24} color="#FFD700" style={styles.logoIcon} />
            <Text style={[styles.logoText, {fontSize: fontSize.medium}]}>KARGAMOTO</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigateTo('ProfilesettingScreen')}
          >
            <Ionicons name="menu" size={isTablet ? 32 : 24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: spacing.large}}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Wallet Card with Animation */}
        <Animated.View 
          style={[
            styles.walletCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#131313', '#272727']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletGradient}
          >
            <View style={styles.walletHeader}>
              <Text style={[styles.walletTitle, {fontSize: fontSize.large}]}>Your Balance</Text>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="#FFD700" />
            </View>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceAmount, {fontSize: fontSize.xlarge}]}>
                {formatCurrency(1000000000)}
              </Text>
              <TouchableOpacity 
                style={styles.depositButton}
                onPress={animateTouchable}
              >
                <LinearGradient
                  colors={['#000000', '#BBBBBB']}
                  style={styles.depositGradient}
                >
                  <Text style={[styles.depositText, {fontSize: fontSize.small}]}>DEPOSIT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Ride Options with Animation */}
        <Animated.View 
  style={[
    styles.rideOptionsContainer,
    {
      opacity: fadeAnim,
      transform: [{ translateY: translateYAnim }]
    }
  ]}
>
  <TouchableOpacity 
    style={styles.rideOption} 
    onPress={() => navigateTo('RideScreen')}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={['#000000', '#000000']}
      style={styles.rideGradient}
    >
      <View style={styles.rideOptionIconContainer}>
        <Image 
          source={require('../../assets/ride.png')} 
          style={styles.rideOptionImage} 
        />
      </View>
      <Text style={[styles.rideOptionText, { fontSize: fontSize.medium }]}></Text>
    </LinearGradient>
  </TouchableOpacity>
  
  <TouchableOpacity 
    style={styles.rideOption}
    onPress={() => navigateTo('DeliveryScreen')}
    activeOpacity={0.8}
  >
    <LinearGradient
      colors={['#000000', '#000000']}
      style={styles.rideGradient}
    >
      <View style={styles.rideOptionIconContainer}>
        <Image 
          source={require('../../assets/deliver.png')} 
          style={styles.rideOptionImage} 
        />
      </View>
      <Text style={[styles.rideOptionText, { fontSize: fontSize.medium }]}></Text>
    </LinearGradient>
  </TouchableOpacity>
</Animated.View>
        
        {/* Features Section with Animation */}
        <Animated.View 
          style={[
            styles.featuresSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, {fontSize: fontSize.medium}]}>Features</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Explore</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.sectionDescription, {fontSize: fontSize.small}]}>
            Discover our latest services
          </Text>
          
          {/* Enhanced Carousel */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={windowWidth - (spacing.medium * 2)}
              height={isTablet ? 300 : 200}
              autoPlay={true}
              autoPlayInterval={5000}
              data={carouselItems}
              scrollAnimationDuration={1000}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={animateTouchable}
                  style={styles.carouselItemContainer}
                >
                  <SharedElement id={`item.${index}.image`}>
                    <Image 
                      source={{ uri: item.uri }} 
                      style={styles.carouselImage} 
                      resizeMode="cover" 
                    />
                  </SharedElement>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.carouselGradient}
                  >
                    <Text style={styles.carouselTitle}>{item.title}</Text>
                    <Text style={styles.carouselDescription}>{item.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
          
          {/* Promotions Section */}
          <View style={styles.promotionsContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitle, {fontSize: fontSize.medium}]}>Current Promotions</Text>
            </View>
            
            <View style={styles.promotionCard}>
              <LinearGradient
                colors={['#4A148C', '#7B1FA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.promotionGradient}
              >
                <View style={styles.promotionContent}>
                  <View>
                    <Text style={styles.promotionTitle}>Weekend Special</Text>
                    <Text style={styles.promotionDescription}>Get 20% off on all rides this weekend!</Text>
                  </View>
                  <TouchableOpacity style={styles.promotionButton}>
                    <Text style={styles.promotionButtonText}>Claim</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Bottom Navigation with Animation */}
      <Animated.View 
        style={[
          styles.bottomNav,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#1A1A1A', '#000000']}
          style={styles.bottomNavGradient}
        >
          {[
            {name: 'home', label: 'Home', active: true},
            {name: 'card-outline', label: 'Payments'},
            {name: 'heart-outline', label: 'Favorites'},
            {name: 'notifications-outline', label: 'Notifications'}
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.navItem}
              onPress={animateTouchable}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.name} 
                size={isTablet ? 28 : 24} 
                color={item.active ? "#69247C" : "#FFFFFF"} 
              />
              <Text 
                style={[
                  styles.navText, 
                  {fontSize: fontSize.small, color: item.active ? "#69247C" : "#FFFFFF"}
                ]}
              >
                {item.label}
              </Text>
              {item.active && (
                <View style={styles.activeIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    height: 90,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:'15%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: '100%',
  },
  logoIcon: {
    marginRight: 8,
  },
  logoText: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  walletCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  walletGradient: {
    padding: 20,
    borderRadius: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  balanceAmount: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  depositButton: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  depositGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  depositText: {
    fontWeight: '600',
    color: 'white',
  },
  walletStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  walletStat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  walletStatText: {
    color: '#DDDDDD',
    fontSize: 12,
    marginLeft: 4,
  },
  
  rideOptionImage: {
    width: 100,
    height: '120%',
    resizeMode: 'contain'
  },
  
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rideOption: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rideGradient: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  seeAllButton: {
    padding: 4,
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  historyScroll: {
    flexDirection: 'row',
  },
  historyItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyItemIcon: {
    marginRight: 8,
  },
  historyItemText: {
    fontWeight: '500',
    color: '#333333',
  },
  featuresSection: {
    marginBottom: 16,
  },
  sectionDescription: {
    color: '#BBBBBB',
    marginBottom: 16,
  },
  carouselContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  carouselItemContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    height: '100%',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  carouselTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  carouselDescription: {
    color: '#EEEEEE',
    fontSize: 14,
  },
  promotionsContainer: {
    marginBottom: 24,
  },
  promotionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  promotionGradient: {
    padding: 16,
    borderRadius: 16,
  },
  promotionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  promotionDescription: {
    color: '#EEEEEE',
    fontSize: 14,
    maxWidth: '80%',
  },
  promotionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  promotionButtonText: {
    color: '#7B1FA2',
    fontWeight: 'bold',
  },

  bottomNavGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
    marginLeft:20,
    marginRight:20,
    marginBottom:20,
    borderRadius: 50,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  navText: {
    marginTop: 6,
    fontWeight: '500',
  },
});