import React, { useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import styles from '../../styles/on1'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'; 
import * as Network from 'expo-network';
import { useNavigation } from '@react-navigation/native';
import { testServer } from '../../services/Loginapi'; // Adjust the import path as necessary
const { width } = Dimensions.get('window');

const OnboardingScreen2 = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lottieSlideAnim = useRef(new Animated.Value(-width)).current; 

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // 1. Check for internet connection
        const networkState = await Network.getNetworkStateAsync();
        const isConnected = networkState.isConnected && networkState.isInternetReachable;
  
        if (!isConnected) {
          console.log('❌ No internet connection');
          navigation.navigate('NoInternetScreen'); // Navigate to a "No Internet" screen
          return; // Exit early if no internet
        }
      
         // 2. Test server connection with proper error handling
         const serverTest = await testServer();
         if (!serverTest.connected) {
           console.log('❌ Server connection failed');
           navigation.navigate('NoInternetScreen');
           return;
         }
         console.log('✅ Server connection successful');
    
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        const token = await SecureStore.getItemAsync('token');
  
        console.log(hasCompletedOnboarding);
        console.log(token);
  
        if (hasCompletedOnboarding === null) {
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.spring(lottieSlideAnim, { toValue: 0, tension: 30, friction: 7, useNativeDriver: true })
          ]).start();
        } else if (hasCompletedOnboarding === 'true' && token === null) {
          navigation.navigate('LoginScreen');
        } else if (hasCompletedOnboarding === 'true' && token !== null) {
          // Change when its Driver or Passenger
          const userDetails = await AsyncStorage.getItem('userDetails');
          const userDetailsParsed = JSON.parse(userDetails);
          console.log("User Details:", userDetailsParsed);
          if (userDetailsParsed.user_type == "Driver") { 
            navigation.navigate('LandingPageRider');
          }else if(userDetailsParsed.user_type == "Passenger"){
            navigation.navigate('LandingPageScreen');
          }else { 
            console.log("User type not recognized:", userDetailsParsed.user_type);
          }
         
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
      }
    };
  
    checkOnboardingStatus();
  }, []);

  const handleNext = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -50, duration: 300, useNativeDriver: true }),
        Animated.timing(lottieSlideAnim, { toValue: width, duration: 300, useNativeDriver: true })
      ]).start(() => {
        navigation.navigate('Onboarding2');
      });
    } catch (error) {
      console.error('Failed to set onboarding status:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['transparent', 'rgba(250, 250, 250, 0.8)', 'rgba(250, 250, 250, 0.8)']} style={styles.gradient} />
      
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerContainer}>
          <Animated.View style={[styles.lottieContainer, { transform: [{ translateX: lottieSlideAnim }] }]}>
            <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
              <Text style={styles.logoText}>KARGAMOTO</Text>
            </Animated.View>
            <LottieView source={{ uri: 'https://lottie.host/7e9c099d-8dc4-4129-ba4d-20fd0ead33cf/NqN84LP2cn.lottie' }} autoPlay loop style={styles.lottieAnimation} />
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.ctaText}>GET STARTED</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen2;
