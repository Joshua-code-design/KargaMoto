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
import { useNavigation,useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedElement } from 'react-navigation-shared-element';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const isSmallDevice = windowWidth < 375;
  const isTablet = windowWidth > 768;
  
  // Animated values
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  
  
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
    Animated.stagger(150, [
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
    outputRange: [Platform.OS === 'ios' ? 110 : 90, 70],
    extrapolate: 'clamp',
  });

  // Animation for touchable feedback
  const animateTouchable = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Navigation with transition
  const navigateTo = (screen, params = {}) => {
    animateTouchable();
    navigation.navigate(screen, params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#000000"
        translucent
      />
      
      {/* Animated Header with Glass Effect */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            opacity: headerOpacity,
            height: headerHeight,
          }
        ]}
      >
        <BlurView intensity={80} tint="dark" style={styles.headerBlur}>
          <LinearGradient
            colors={['rgba(26,26,26,0.8)', 'rgba(18,18,18,0.85)']}
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
              <View style={styles.profileIconContainer}>
                <Ionicons name="person" size={isTablet ? 24 : 18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: spacing.large * 2}}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Wallet Card with Modern Animation */}
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
              <Text style={[styles.walletTitle, {fontSize: fontSize.medium}]}>Your Balance</Text>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="#FFD700" />
            </View>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceAmount, {fontSize: fontSize.xlarge}]}>
                {formatCurrency(10000)}
              </Text>
              <TouchableOpacity 
                style={styles.depositButton}
                onPress={animateTouchable}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFC107']}
                  style={styles.depositGradient}
                >
                  <Text style={[styles.depositText, {fontSize: fontSize.small}]}>DEPOSIT</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          
           
          </LinearGradient>
        </Animated.View>
        
        {/* Modernized Ride Options */}
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
            onPress={() => navigateTo('RideScreen', { serviceType: 'Ride' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#222222', '#000000']}
              style={styles.rideGradient}
            >
              <View style={styles.rideOptionContent}>
                <Image 
                  source={require('../../assets/kms.png')} 
                  style={styles.rideOptionImage} 
                />
                <View style={styles.rideTextContainer}>
                  <Text style={[styles.rideOptionText, { fontSize: fontSize.medium }]}>RIDE</Text>
                  <Text style={styles.rideOptionSubtext}>Book now</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.rideOption}
            onPress={() => navigateTo('RideScreen', { serviceType: 'Delivery' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#222222', '#000000']}
              style={styles.rideGradient}
            >
              <View style={styles.rideOptionContent}>
                <Image 
                  source={require('../../assets/kms.png')} 
                  style={styles.rideOptionImage} 
                />
                <View style={styles.rideTextContainer}>
                  <Text style={[styles.rideOptionText, { fontSize: fontSize.medium }]}>DELIVERY</Text>
                  <Text style={styles.rideOptionSubtext}>Send packages</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Recent Destinations Section */}
        <Animated.View 
          style={[
            styles.recentSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }]
            }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, {fontSize: fontSize.medium}]}>Recent Places</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentScrollContent}
          >
            {recentDestinations.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.recentItem}
                onPress={animateTouchable}
              >
                <View style={styles.recentIconContainer}>
                  <FontAwesome5 name={item.icon} size={16} color="#FFD700" />
                </View>
                <Text style={styles.recentText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        
        {/* Features Carousel with Animation */}
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
            <Text style={[styles.sectionTitle, {fontSize: fontSize.medium}]}>Featured</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Explore</Text>
            </TouchableOpacity>
          </View>
          
          {/* Enhanced Carousel */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={windowWidth - (spacing.medium * 2)}
              height={isTablet ? 260 : 180}
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
        
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Modernized Bottom Navigation with Glass Effect*/}
      <BlurView intensity={90} tint="dark" style={styles.bottomNavBlur}>
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
            colors={['rgba(26,26,26,0.8)', 'rgba(0,0,0,0.85)']}
            style={styles.bottomNavGradient}
          >
            {[
              {name: 'home', label: 'Home', active: true},
              {name: 'card-outline', label: 'Payments'},
              {name: 'compass-outline', label: 'Explore'},
              {name: 'person-outline', label: 'Profile'}
            ].map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.navItem}
                onPress={animateTouchable}
                activeOpacity={0.7}
              >
                {item.active && <View style={styles.activeIndicator} />}
                <Ionicons 
                  name={item.name} 
                  size={isTablet ? 24 : 22} 
                  color={item.active ? "#FFD700" : "#FFFFFF"} 
                />
                <Text 
                  style={[
                    styles.navText, 
                    {fontSize: fontSize.small, color: item.active ? "#FFD700" : "#FFFFFF"}
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerBlur: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    height: '100%',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 8,
  },
  logoText: {
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  profileIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingHorizontal: 16,
  },
  walletCard: {
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  walletGradient: {
    padding: 20,
    borderRadius: 20,
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
    letterSpacing: 0.5,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  balanceAmount: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  depositButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  depositGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  depositText: {
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionText: {
    color: '#DDDDDD',
    fontSize: 12,
  },
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rideOption: {
    width: '48%',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rideGradient: {
    padding: 16,
    height: 100,
    justifyContent: 'center',
  },
  rideOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rideOptionImage: {
    width: 60,
    height: 60,
  },
  rideTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rideOptionText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
  },
  rideOptionSubtext: {
    fontSize: 12,
    color: '#BBBBBB',
    marginTop: 4,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentScrollContent: {
    paddingRight: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  recentText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  featuresSection: {
    marginBottom: 16,
  },
  carouselContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  carouselItemContainer: {
    borderRadius: 20,
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
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFD700',
    width: 16,
  },
  promotionsContainer: {
    marginBottom: 24,
  },
  promotionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  promotionGradient: {
    padding: 20,
    borderRadius: 20,
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promotionButtonText: {
    color: '#7B1FA2',
    fontWeight: 'bold',
  },
  bottomNavBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  bottomNavGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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