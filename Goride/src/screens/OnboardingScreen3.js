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
    padding: width * 0.05,
    marginBottom: height * 0.2,
    marginTop: height * 0.05,
  },
  termsTitle: {
    fontSize: width * 0.08,
    fontWeight: '800',
    marginBottom: height * 0.03,
    textAlign: 'center',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: width * 0.06,
    padding: width * 0.08,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: {
    fontSize: width * 0.06,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: height * 0.02,
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: width * 0.043,
    color: '#374151',
    marginBottom: height * 0.04,
    lineHeight: width * 0.065,
  },
  termsList: {
    gap: height * 0.025,
  },
  termItem: {
    flexDirection: 'row',
    gap: width * 0.04,
    alignItems: 'center',
  },
  termNumberContainer: {
    backgroundColor: 'black',
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  termNumber: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '700',
  },
  termContent: {
    flex: 1,
    fontSize: width * 0.04,
    lineHeight: width * 0.06,
    color: '#374151',
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: width * 0.05,
    borderRadius: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  checkbox: {
    width: width * 0.07,
    height: width * 0.07,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: width * 0.02,
    marginRight: width * 0.04,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: 'black',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: width * 0.04,
    color: '#1A1A1A',
    flex: 1,
    fontWeight: '600',
  },
  radioContainer: {
    position: 'absolute',
    bottom: height * 0.15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
  },
  radioButton: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: 'rgba(255,255,255,0.4)',
    margin: width * 0.01,
  },
  radioButtonActive: {
    backgroundColor: 'black',
    width: width * 0.06,
    height: width * 0.02,
    borderRadius: width * 0.01,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    left: width * 0.06,
    right: width * 0.06,
  },
  button: {
    height: height * 0.07,
    borderRadius: width * 0.075,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: 'white',
    fontSize: width * 0.045,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
    padding: height * 0.02,
  }
});

export default OnboardingScreen2;