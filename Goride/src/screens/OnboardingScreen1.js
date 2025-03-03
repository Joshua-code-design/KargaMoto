import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen2 = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const lottieSlideAnim = useRef(new Animated.Value(-width)).current; 

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(lottieSlideAnim, {
        toValue: 0,
        tension: 30,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleNext = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(lottieSlideAnim, {
        toValue: width, // Changed to slide right
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      navigation.navigate('Onboarding2');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      

      <LinearGradient
        colors={['transparent', 'rgba(250, 250, 250, 0.8)', 'rgba(250, 250, 250, 0.8)']}
        style={styles.gradient}
      />
      <Animated.View style={[styles.contentContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <View style={styles.headerContainer}>
          <Animated.View style={[styles.lottieContainer, {
            transform: [{ translateX: lottieSlideAnim }]
          }]}>
            <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.logoText}>KARGA MOTO</Text>
      </Animated.View>
            <LottieView
              source={{ uri: 'https://lottie.host/7e9c099d-8dc4-4129-ba4d-20fd0ead33cf/NqN84LP2cn.lottie' }}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
          </Animated.View>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.bottomContainer, {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }]}>
        <View style={styles.progressContainer}>
          {[...Array(6)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === 0 && styles.progressDotActive 
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>GET STARTED</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  lottieContainer: {
    width: '130%',
    marginTop: 150,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 28,
    color: '#E5E7EB',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    margin: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 8,
    borderRadius: 4,
    transform: [{scale: 1}],
  },
  ctaButton: {
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: 'white',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    backgroundColor: '#000000',
    padding: 20,
    transform: [{ perspective: 1000 }],
  },
  ctaText: {
    color: 'rgba(250, 250, 250, 0.8)',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bangersRegular: {
    fontFamily: "Bangers",
    fontWeight: '400',
    fontStyle: 'normal',
  },
  
  welcomeText: {
    fontSize: 60,
    color: '#000000',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 50,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#2c3e50',
  },
});

export default OnboardingScreen2;