import React from 'react';
import { View, Image, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import styles from '../styles/screen2'; 

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
     
      <View style={styles.radioContainer}>
        {[...Array(2)].map((_, index) => (
          <View
            key={index}
            style={[styles.radioButton, index === 0 && styles.radioButtonActive]}
          />
        ))}
      </View>

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

export default OnboardingScreen1;
