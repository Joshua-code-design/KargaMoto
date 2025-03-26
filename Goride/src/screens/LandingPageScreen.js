import React, { useState, useEffect } from 'react';
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
  useWindowDimensions
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedElement } from 'react-navigation-shared-element';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// New professional color palette
const COLORS = {
  primary: '#1A2B4D',       // Deep Navy Blue
  secondary: '#2E7D32',     // Forest Green
  tertiary: '#26A69A',      // Soft Teal
  accent: '#D4AF37',        // Muted Gold
  background: '#F5F5F5',    // Light Gray
  white: '#FFFFFF',         // White
  lightGray: '#E0E0E0',     // Very Light Gray
  darkGray: '#333333',      // Charcoal Gray
  error: '#E53935',         // Bright Red
};

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

  // Navigation with transition
  const navigateTo = (screen, params = {}) => {
    navigation.navigate(screen, params);
  };

  // Calculate carousel dimensions dynamically
  const carouselWidth = windowWidth - (spacing.medium * 2);
  const carouselHeight = isTablet ? windowWidth * 0.25 : windowWidth * 0.4;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={COLORS.background}
        translucent
      />
      
      {/* Header */}
      <View 
        style={[
          styles.header, 
          { 
            backgroundColor: COLORS.background,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.background,
          }
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLogo}>
            <MaterialCommunityIcons name="motorbike" size={24} color={COLORS.tertiary} style={styles.logoIcon} />
            <Text style={[styles.logoText, {fontSize: fontSize.medium, color: COLORS.tertiary}]}>KARGAMOTO</Text>
          </View>
          <TouchableOpacity
            style={[styles.menuButton, { backgroundColor: COLORS.tertiary }]}
            onPress={() => navigateTo('MessagesScreen')}
          >
            <Ionicons name="chatbubble-ellipses" size={isTablet ? 24 : 18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: spacing.large * 3}}
      >
        {/* Wallet Card */}
        <View 
          style={[
            styles.walletCard,
            {
              marginHorizontal: spacing.medium,
              marginTop: spacing.large,
              backgroundColor: COLORS.tertiary,
              borderRadius: 16,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }
          ]}
        >
          <View style={styles.walletContent}>
            <View style={styles.walletHeader}>
              <Text style={[styles.walletTitle, {fontSize: fontSize.medium, color: COLORS.white}]}>Your Balance</Text>
              <MaterialCommunityIcons name="wallet-outline" size={24} color={COLORS.white} />
            </View>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceAmount, {fontSize: fontSize.xlarge, color: COLORS.white}]}>
                {formatCurrency(10000)}
              </Text>
              <TouchableOpacity 
                style={[styles.depositButton, { backgroundColor: COLORS.white }]}
              >
                <Text style={[styles.depositText, {fontSize: fontSize.small, color: COLORS.darkGray, fontWeight: '600'}]}>DEPOSIT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Ride Options */}
        <View 
          style={[
            styles.rideOptionsContainer,
            {
              marginHorizontal: spacing.medium,
              marginTop: spacing.large
            }
          ]}
        >
          <TouchableOpacity 
            style={[
              styles.rideOption, 
              { 
                marginRight: spacing.small / 2,
                backgroundColor: COLORS.white,
                borderRadius: 16,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }
            ]} 
            onPress={() => navigateTo('RideScreen', { serviceType: 'Ride' })}
            activeOpacity={0.8}
          >
            <View style={styles.rideOptionContent}>
              <View style={[
                styles.rideIconContainer, 
                { backgroundColor: COLORS.lightGray }
              ]}>
                <Image 
                  source={require('../../assets/kms.png')} 
                  style={[styles.rideOptionImage, {width: isTablet ? 60 : 40, height: isTablet ? 60 : 40}]} 
                  resizeMode="contain"
                />
              </View>
              <View style={styles.rideTextContainer}>
                <Text style={[
                  styles.rideOptionText, 
                  { fontSize: fontSize.medium, color: COLORS.primary, fontWeight: '600' }
                ]}>RIDE</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.rideOption, 
              { 
                marginLeft: spacing.small / 2,
                backgroundColor: COLORS.white,
                borderRadius: 16,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }
            ]}
            onPress={() => navigateTo('RideScreen', { serviceType: 'Delivery' })}
            activeOpacity={0.8}
          >
            <View style={styles.rideOptionContent}>
              <View style={[
                styles.rideIconContainer, 
                { backgroundColor: COLORS.lightGray }
              ]}>
                <Image 
                  source={require('../../assets/kms.png')} 
                  style={[styles.rideOptionImage, {width: isTablet ? 60 : 40, height: isTablet ? 60 : 40}]}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.rideTextContainer}>
                <Text style={[
                  styles.rideOptionText, 
                  { fontSize: fontSize.medium, color: COLORS.primary, fontWeight: '600' }
                ]}>DELIVERY</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Recent Destinations Section */}
        <View 
          style={[
            styles.recentSection,
            {
              marginTop: spacing.large,
              paddingHorizontal: spacing.medium
            }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={[
              styles.sectionTitle, 
              {fontSize: fontSize.medium, color: COLORS.primary, fontWeight: '600'}
            ]}>Recent Places</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigateTo('AllPlacesScreen')}
            >
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
                    minWidth: isTablet ? 120 : 90,
                    backgroundColor: COLORS.white,
                    borderRadius: 12,
                    shadowColor: COLORS.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }
                ]}
                onPress={() => navigateTo('LocationScreen', { location: item.name })}
              >
                <View style={[
                  styles.recentIconContainer,
                  {
                    width: isTablet ? 42 : 32,
                    height: isTablet ? 42 : 32,
                    marginBottom: spacing.xs,
                    backgroundColor: COLORS.lightGray,
                    borderRadius: isTablet ? 21 : 16,
                  }
                ]}>
                  <FontAwesome5 name={item.icon} size={isTablet ? 18 : 14} color={COLORS.primary} /> 
                </View>
                <Text style={[
                  styles.recentText, 
                  {fontSize: fontSize.small, color: COLORS.darkGray, fontWeight: '500'}
                ]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Features Carousel */}
        <View 
          style={[
            styles.featuresSection,
            {
              marginTop: spacing.large,
              paddingHorizontal: spacing.medium
            }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={[
              styles.sectionTitle, 
              {fontSize: fontSize.medium, color: COLORS.primary, fontWeight: '600'}
            ]}>Featured</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => navigateTo('FeaturedScreen')}
            >
              <Text style={[
                styles.seeAllText, 
                {fontSize: fontSize.small, color: COLORS.secondary}
              ]}>Explore</Text>
            </TouchableOpacity>
          </View>
          
          {/* Carousel with Modern Design */}
          <View style={[
            styles.carouselContainer, 
            {
              marginTop: spacing.small,
              borderRadius: 16,
              overflow: 'hidden',
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }
          ]}>
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
                  onPress={() => navigateTo('FeatureDetailScreen', { feature: item })}
                  style={[styles.carouselItemContainer, {borderRadius: 16}]}
                >
                  <SharedElement id={`item.${index}.image`}>
                    <Image 
                      source={{ uri: item.uri }} 
                      style={[styles.carouselImage, { borderRadius: 16 }]} 
                      resizeMode="cover"
                      defaultSource={require('../../assets/kms.png')} // Fallback image
                    />
                  </SharedElement>
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={[styles.carouselGradient, { borderRadius: 16 }]}
                  >
                    <Text style={[
                      styles.carouselTitle, 
                      {fontSize: fontSize.medium, color: COLORS.white, fontWeight: '600'}
                    ]}>{item.title}</Text>
                    <Text style={[
                      styles.carouselDescription, 
                      {fontSize: fontSize.small, color: COLORS.white}
                    ]}>{item.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <View style={[
        styles.bottomNav,
        {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.lightGray,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 5,
        }
      ]}>
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
            {item.active && (
              <View style={[
                styles.activeIndicator, 
                { backgroundColor: COLORS.secondary }
              ]} />
            )}
            <Ionicons
              name={item.name}
              size={isTablet ? 24 : 22}
              color={item.active ? COLORS.secondary : COLORS.darkGray}
            />
            <Text
              style={[
                styles.navText,
                { 
                  fontSize: fontSize.small, 
                  color: item.active ? COLORS.secondary : COLORS.darkGray,
                  fontWeight: item.active ? '600' : '400'
                }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: '100%',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(4),
  },
  logoIcon: {
    marginRight: hp(2),
  },
  logoText: {
    fontWeight: '700',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 110 : 90,
  },
  walletCard: {
    overflow: 'hidden',
  },
  walletContent: {
    padding: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    fontWeight: '500',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontWeight: '700',
  },
  depositButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  depositText: {
    fontWeight: '600',
  },
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideOption: {
    flex: 1,
    height: 80,
    overflow: 'hidden',
  },
  rideOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  rideIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rideOptionImage: {
    width: 40,
    height: 40,
  },
  rideTextContainer: {
    flex: 1,
  },
  rideOptionText: {
    fontWeight: '600',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  seeAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  seeAllText: {
    fontWeight: '500',
  },
  recentScrollContent: {
    paddingVertical: 8,
  },
  recentItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentText: {
    textAlign: 'center',
    marginTop: 4,
  },
  carouselContainer: {
    marginVertical: 8,
  },
  carouselItemContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
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
    fontWeight: '700',
    marginBottom: 4,
  },
  carouselDescription: {
    fontWeight: '400',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    marginBottom: hp(2),
    marginHorizontal: hp(4),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
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
  },
  navText: {
    marginTop: 4,
  },
});