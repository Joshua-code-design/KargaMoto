import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';

const OnboardingScreen2 = ({ navigation }) => {

  const handleNext = () => {
    navigation.navigate('Onboarding6'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Goride</Text>
        <Text style={styles.description}>
          TUTORIAL
        </Text>
      </View>

      {/* Radio button indicators */}
      <View style={styles.radioContainer}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.radioButton,
              index === 5 && styles.radioButtonActive 
            ]}
          />
        ))}
      </View>

      {/* Navigation buttons container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.nextButton]}
          onPress={handleNext}
          activeOpacity={0.7} 
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginTop: 100,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black', // Changed to black for better visibility
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333333', // Darker color for better visibility
    textAlign: 'center',
    lineHeight: 24,
  },
  radioContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  radioButton: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666666',
    margin: 4,
  },
  radioButtonActive: {
    backgroundColor: 'black',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: 120,
  },
  nextButton: {
    backgroundColor: '#141010',
  },
  skipButton: {
    backgroundColor: '#fcfefe',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButtonText: {
    color: '#141010',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OnboardingScreen2;