import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  useWindowDimensions
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SharedElement } from 'react-navigation-shared-element';
import ButtonBar from '../../components/ButtonbarHome';
import styles from '../../styles/landingpage';

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
      uri: 'https://thumbs.dreamstime.com/z/modern-taxi-banner-ad-promotional-code-vector-illustration-free-ride-discount-card-top-view-city-map-geolocatio-157567537.jpg',
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
    { name: 'Ayala Mall', icon: 'store' }
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
            onPress={() => navigateTo('SocketTest')}
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
          <MaterialCommunityIcons 
            name="wallet-outline" 
            size={20} 
            color={COLORS.textDark} 
            style={styles.walletIcon} 
          />
            <View style={styles.walletHeader}>
              <Text style={[styles.walletTitle, {fontSize: fontSize.medium, color: COLORS.white}]}>Your Balance</Text>
              <Text style={[styles.walletTitle, {fontSize: fontSize.medium, color: COLORS.white}]}>Earning of your cashiess transaction</Text>
              
            </View>
            <View>
            </View>
            
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceAmount, {fontSize: fontSize.xlarge, color: COLORS.white}]}>
                {formatCurrency(10000)}
              </Text>
              
              
            </View>
            <View style={styles.balanceRow}>
            <TouchableOpacity 
                style={[styles.depositButton, { backgroundColor: COLORS.white }]}
              >
                <Text style={[styles.depositText, {fontSize: fontSize.small, color: COLORS.darkGray, fontWeight: '600'}]}>CASH-OUT</Text>
                
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.depositButton, { backgroundColor: COLORS.white }]}
              >
                <Text style={[styles.depositText, {fontSize: fontSize.small, color: COLORS.darkGray, fontWeight: '600'}]}>TRANSFER</Text>
              </TouchableOpacity>
              </View> 
          </View>
        </View>

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
              <Text style={[styles.walletTitle, {fontSize: fontSize.medium, color: COLORS.white}]}>KARGA Moto Credit</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={[styles.balanceAmount, {fontSize: fontSize.xlarge, color: COLORS.white}]}>
                {formatCurrency(10000)}
              </Text>
            </View>
            <Text style={[styles.walletTitle, {fontSize: fontSize.medium, color: COLORS.white}]}>Minimum balance to accept a booking</Text>
            <View style={styles.balanceRow}>
            <TouchableOpacity 
                style={[styles.depositButton, { backgroundColor: COLORS.white }]}
              >
                <Text style={[styles.depositText, {fontSize: fontSize.small, color: COLORS.darkGray, fontWeight: '600'}]}>Top Up</Text>
              </TouchableOpacity>
              
            </View>
          </View>
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
                      defaultSource={require('../../../assets/kms.png')} // Fallback image
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
      <ButtonBar isTablet={isTablet} />
    </SafeAreaView>
  );
}

