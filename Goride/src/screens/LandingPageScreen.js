import React, { useRef, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Animated,
  useWindowDimensions
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedElement } from 'react-navigation-shared-element';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  // Use the hook for responsive dimensions
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const navigation = useNavigation();
  
  // Dynamically determine device size
  const [deviceSize, setDeviceSize] = useState({
    isSmallDevice: windowWidth < 375,
    isTablet: windowWidth > 768
  });

  // Update device size on dimension changes
  useEffect(() => {
    setDeviceSize({
      isSmallDevice: windowWidth < 375,
      isTablet: windowWidth > 768
    });
  }, [windowWidth]);
  
  // Destructure for cleaner code
  const { isSmallDevice, isTablet } = deviceSize;
  
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

  // Modern carousel images with better quality and error handling
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

  // Animation for touchable feedback with error handling
  const animateTouchable = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not available');
    }
  };

  // Navigation with transition
  const navigateTo = (screen, params = {}) => {
    animateTouchable();
    navigation.navigate(screen, params);
  };

  // Calculate carousel dimensions dynamically
  const carouselWidth = windowWidth - (spacing.medium * 2);
  const carouselHeight = isTablet ? windowWidth * 0.25 : windowWidth * 0.4;

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
            colors={['black', 'black']}
            style={styles.headerGradient}
          >
            <View style={styles.headerLogo}>
              <MaterialCommunityIcons name="motorbike" size={24} color="#4E4FEB" style={styles.logoIcon} />
              <Text style={[styles.logoText, {fontSize: fontSize.medium}]}>KARGAMOTO</Text>
            </View>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => navigateTo('MessagesScreen')}
            >
              <View style={styles.messageIconContainer}>
                <Ionicons name="chatbubble-ellipses" size={isTablet ? 24 : 18} color="#4E4FEB" />
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
              transform: [{ scale: scaleAnim }],
              marginHorizontal: spacing.medium,
              marginTop: spacing.medium
            }
          ]}
        >
          <LinearGradient
            colors={['black', '#070717', 'red' , 'black' ]} 
            top={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            bottom={{ x: 1, y: 1 }}
            style={styles.walletGradient}
          >
            <View style={styles.walletHeader}>
              <Text style={[styles.walletTitle, {fontSize: fontSize.medium}]}>Your Balance</Text>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="black" />
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
                  colors={['#0000', '#4E4FEB']}
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
              transform: [{ translateY: translateYAnim }],
              marginHorizontal: spacing.medium,
              marginTop: spacing.medium
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.rideOption, { marginRight: spacing.small / 2 }]} 
            onPress={() => navigateTo('RideScreen', { serviceType: 'Ride' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[ '#4E4FEB','#1F1F5E']} 
              style={styles.rideGradient}
            >
              <View style={styles.rideOptionContent}>
                <Image 
                  source={require('../../assets/kms.png')} 
                  style={[styles.rideOptionImage, {width: isTablet ? 60 : 40, height: isTablet ? 60 : 40}]} 
                  resizeMode="contain"
                />
                <View style={styles.rideTextContainer}>
                  <Text style={[styles.rideOptionText, { fontSize: fontSize.medium }]}>RIDE</Text>
                  {/* <Text style={[styles.rideOptionSubtext, { fontSize: fontSize.small }]}>Book now</Text> */}
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.rideOption, { marginLeft: spacing.small / 2 }]}
            onPress={() => navigateTo('RideScreen', { serviceType: 'Delivery' })}
            activeOpacity={0.8}
          >
            <LinearGradient
            
              colors={['#4E4FEB', '#1F1F5E']} 
              style={styles.rideGradient}
            >
              <View style={styles.rideOptionContent}>
                <Image 
                  source={require('../../assets/kms.png')} 
                  style={[styles.rideOptionImage, {width: isTablet ? 60 : 40, height: isTablet ? 60 : 40}]}
                  resizeMode="contain"
                />
                <View style={styles.rideTextContainer}>
                  <Text style={[styles.rideOptionText, { fontSize: fontSize.medium }]}>DELIVERY</Text>
                  {/* <Text style={[styles.rideOptionSubtext, { fontSize: fontSize.small }]}>Send packages</Text> */}
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
              transform: [{ translateY: translateYAnim }],
              marginTop: spacing.medium,
              paddingHorizontal: spacing.medium
            }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, {fontSize: fontSize.medium}]}>Recent Places</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, {fontSize: fontSize.small}]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.recentScrollContent, {paddingVertical: spacing.small}]}
          >
            {recentDestinations.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.recentItem,
                  {
                    marginRight: spacing.small,
                    padding: spacing.small,
                    minWidth: isTablet ? 120 : 90
                  }
                ]}
                onPress={animateTouchable}
              >
                <View style={[
                  styles.recentIconContainer,
                  {
                    width: isTablet ? 42 : 32,
                    height: isTablet ? 42 : 32,
                    marginBottom: spacing.xs
                  }
                ]}>
                  {/* icons */}
                  <FontAwesome5 name={item.icon} size={isTablet ? 18 : 14} color="white" /> 
                </View>
                <Text style={[styles.recentText, {fontSize: fontSize.small}]}>{item.name}</Text>
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
              transform: [{ translateY: translateYAnim }],
              marginTop: spacing.medium,
              paddingHorizontal: spacing.medium
            }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, {fontSize: fontSize.medium}]}>Featured</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, {fontSize: fontSize.small}]}>Explore</Text>
            </TouchableOpacity>
          </View>
          
          {/* Enhanced Carousel */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              width={carouselWidth}
              height={carouselHeight}
              autoPlay={true}
              autoPlayInterval={5000}
              data={carouselItems}
              scrollAnimationDuration={1000}
              renderItem={({ item, index }) => (
                <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={animateTouchable}
                  style={[styles.carouselItemContainer, {borderRadius: spacing.small}]}
                >
                  <SharedElement id={`item.${index}.image`}>
                    <Image 
                      source={{ uri: item.uri }} 
                      style={styles.carouselImage} 
                      resizeMode="cover"
                      defaultSource={require('../../assets/kms.png')} // Fallback image
                    />
                  </SharedElement>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.carouselGradient}
                  >
                    <Text style={[styles.carouselTitle, {fontSize: fontSize.medium}]}>{item.title}</Text>
                    <Text style={[styles.carouselDescription, {fontSize: fontSize.small}]}>{item.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Modernized Bottom Navigation with Glass Effect */}
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
            colors={['black', 'rgba(0,0,0,0.85)']}
            style={styles.bottomNavGradient}
          >
            {[
              { name: 'home', label: 'Home', screen: 'LandingPageScreen', active: true },
              { name: 'heart-outline', label: 'Favorites', screen: 'FavScreen', active: false },
              { name: 'person-outline', label: 'Profile', screen: 'ProfilesettingScreen', active: false },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.navItem}
                onPress={() => navigateTo(item.screen)}
                activeOpacity={0.7}
              >
                {item.active && <View style={styles.activeIndicator} />}
                <Ionicons
                  name={item.name}
                  size={isTablet ? 24 : 22}
                  color={item.active ? "#4647D3" : "#4647D3"}
                />
                <Text
                  style={[
                    styles.navText,
                    { fontSize: fontSize.small, color: item.active ? "#4647D3" : "#4647D3" }
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
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBlur: {
    flex: 1,
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
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  messageIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 110 : 90,
  },
  walletCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  walletGradient: {
    padding: 16,
    borderRadius: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  depositButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  depositGradient: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  depositText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideOption: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#00000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  rideGradient: {
    padding: 16,
    borderRadius: 16,
  },
  rideOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideOptionImage: {
    marginRight: 12,
  },
  rideTextContainer: {
    flex: 1,
  },
  rideOptionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rideOptionSubtext: {
    color: '#AAAAAA',
    marginTop: 4,
  },
  recentSection: {
    width: '100%',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  seeAllButton: {
    padding: 4,
  },
  seeAllText: {
    color: '#FFD700',
  },
  recentScrollContent: {
    paddingBottom: 12,
  },
  recentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  recentIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  featuresSection: {
    width: '100%',
  },
  carouselContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  carouselItemContainer: {
    overflow: 'hidden',
    width: '100%',
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
    height: '50%',
    justifyContent: 'flex-end',
  },
  carouselTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  carouselDescription: {
    color: '#DDDDDD',
  },
  bottomNavBlur: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomNav: {
    width: '100%',
    backgroundColor:'black'
  },
  bottomNavGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 16,
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#800000',
  },
  navText: {
    marginTop: 4,
  },
});