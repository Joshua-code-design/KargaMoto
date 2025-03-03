import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen2 = ({ navigation }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleNext = () => {
    if (isChecked) {
      navigation.navigate('loginScreen');
    }
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
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
          <Text style={styles.welcomeText}>
            Welcome to Karga Moto!
          </Text>
          <Text style={styles.termsText}>
            By using our services, you agree to the following terms and conditions:
          </Text>
          <View style={styles.termsList}>
            {[
              "You must be at least 18 years old to use this service.",
              "You agree to provide accurate and complete information when using our service.",
              "You are responsible for maintaining the confidentiality of your account.",
              "GoRide reserves the right to modify or terminate services at any time.",
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
        {[...Array(6)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.radioButton,
              index === 2 && styles.radioButtonActive 
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !isChecked && styles.disabledButton
          ]}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  termsContainer: {
    flex: 1,
    padding: '5%',
    marginBottom: '20%',
    marginTop: '5%',
  },
  termsTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: '8%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 17,
    color: '#374151',
    marginBottom: 32,
    lineHeight: 26,
  },
  termsList: {
    gap: 20,
  },
  termItem: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  termNumberContainer: {
    backgroundColor: 'black',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  termNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  termContent: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: '5%',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 8,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: 'black',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
    fontWeight: '600',
  },
  radioContainer: {
    position: 'absolute',
    bottom: '15%',
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
    backgroundColor: 'rgba(255,255,255,0.4)',
    margin: 4,
  },
  radioButtonActive: {
    backgroundColor: 'black',
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '10%',
    left: '5%',
    right: '5%',
  },
  button: {
    height: 56,
    borderRadius: 30,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    padding: 16,
  }
});

export default OnboardingScreen2;