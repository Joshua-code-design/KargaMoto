import React, { useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import styles from '../styles/on1'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store'; 

const { width } = Dimensions.get('window');

const OnboardingScreen2 = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const lottieSlideAnim = useRef(new Animated.Value(-width)).current; 

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        const token = await SecureStore.getItemAsync('token');

        console.log(hasCompletedOnboarding);
        console.log(token);
        //checks if user has completed onboarding
        if (hasCompletedOnboarding === null) {
          // Stay on OnboardingScreen
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
            Animated.spring(lottieSlideAnim, { toValue: 0, tension: 30, friction: 7, useNativeDriver: true })
          ]).start();
          //if user has completed onboarding and token is null, navigate to login screen
        } else if (hasCompletedOnboarding === 'true' && token === null) {
          navigation.navigate('LoginScreen');
          //if user has completed onboarding and token is not null, navigate to landing page screen
        } else if (hasCompletedOnboarding === 'true' && token !== null) {
          navigation.navigate('LandingPageScreen');
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
              <Text style={styles.logoText}>KARGA MOTO</Text>
            </Animated.View>
            <LottieView source={{ uri: 'https://lottie.host/7e9c099d-8dc4-4129-ba4d-20fd0ead33cf/NqN84LP2cn.lottie' }} autoPlay loop style={styles.lottieAnimation} />
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.progressContainer}>
          {[...Array(6)].map((_, index) => (
            <View key={index} style={[styles.progressDot, index === 0 && styles.progressDotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.ctaText}>GET STARTED</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default OnboardingScreen2;
