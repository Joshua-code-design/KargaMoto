import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, SafeAreaView, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../styles/screen3'; 

const OnboardingScreen3 = ({ navigation }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleNext = () => {
    if (isChecked) {
      navigation.navigate('LoginScreen');
    }
  };

  
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <ScrollView>  
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      />
      <Image
        source={require('../../assets/Habalaaa.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView style={styles.termsContainer}>
        <View style={styles.card}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.welcomeText}>Welcome to Karga Moto!</Text>
          <Text style={styles.termsText}>
            By using our services, you agree to the following terms and conditions:
          </Text>
          <View style={styles.termsList}>
            {[
              "You must be at least 18 years old to use this service.",
              "You agree to provide accurate and complete information when using our service.",
              "You are responsible for maintaining the confidentiality of your account.",
              "KargaMoto reserves the right to modify or terminate services at any time.",
              "You agree to use the service in accordance with all applicable laws and regulations."
            ].map((content, index) => (
              <View key={index} style={styles.termItem}>
                <View style={styles.termNumberContainer}>
                  <Text style={styles.termNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.termContent}>{content}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable onPress={toggleCheckbox} style={styles.checkboxContainer}>
          <View style={[styles.checkbox, isChecked && styles.checkedBox]}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the Terms and Conditions</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.radioContainer}>
        {[...Array(2)].map((_, index) => (
          <View
            key={index}
            style={[styles.radioButton, index === 1 && styles.radioButtonActive]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, !isChecked && styles.disabledButton]}
          onPress={handleNext}
          activeOpacity={0.7}
          disabled={!isChecked}
        >
          
          <LinearGradient
            colors={isChecked ? ['#000000', '#000000'] : ['#9CA3AF', '#6B7280']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.nextButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ScrollView>
  );
};

export default OnboardingScreen3;
  