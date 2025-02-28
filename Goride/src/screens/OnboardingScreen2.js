import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';

const OnboardingScreen1 = ({ navigation }) => {


  const handleNext = () => {
    navigation.navigate('Onboarding3');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/Habal.png')}
        style={styles.fullScreenImage}
        resizeMode="cover"
      />
     
      {/* Radio button indicators */}
      <View style={styles.radioContainer}>
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.radioButton,
              index === 1 && styles.radioButtonActive
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
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'absolute',
    top: '62%',
    paddingHorizontal: 24,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
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
    paddingHorizontal: 24,
    justifyContent: 'center',
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
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OnboardingScreen1;