import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Image, View, TextInput, TouchableOpacity, Text, StyleSheet, SafeAreaView, ActivityIndicator, StatusBar, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Toast = ({ visible, message, type, onClose }) => {
  const [translateYAnim] = useState(new Animated.Value(100));
  
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(translateYAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        onClose && onClose();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const iconName = type === 'success' ? 'check-circle' : 'error';
  const iconColor = type === 'success' ? '#4CAF50' : '#F44336';

  return (
    <Animated.View 
      style={[
        styles.toastContainer,
        { 
          transform: [{ translateY: translateYAnim }]
        }
      ]}
    >
      <View style={styles.toastContent}>
        <MaterialIcons name={iconName} size={20} color={iconColor} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const RegisterScreen = () => {
  const route = useRoute(); 
  const { phoneNumber } = route.params || { phoneNumber: '' }; 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const navigation = useNavigation();
  
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const handleRegister = async () => {
    if (!firstName || !lastName) {
      showToast('Please fill in all fields to continue.', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullname = `${firstName} ${lastName}`;
      const response = await axios.post('http://192.168.1.31:5000/api/register-user', {
        full_name: fullname,
        phone_number: phoneNumber 
      });

      setIsLoading(false);
      
      if (response.status === 200) {
        showToast('Your account has been created successfully!');
        
        setFirstName('');
        setLastName('');
        
        setTimeout(() => {
          navigation.navigate('LoginScreen');
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      showToast(
        error.response?.data?.error || 'Please check your connection and try again.',
        'error'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <Toast 
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />

      <View style={styles.formContainer}>
        <Image 
          source={require('../../assets/km.png')} // Adjust the path to your logo image
          style={styles.logoImage}
        />
        <Text style={styles.logoText}>Account Registration</Text>
        <Text style={styles.subtitle}>Kindly provide your information to proceed.</Text>
        
        <View style={styles.inputsContainer}>
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>Phone Number</Text>
    <View style={[styles.input, styles.disabledInput]}>
      <Image 
        source={require('../../assets/iconphone.png')} 
        style={styles.inputImage} 
      />
      <Text style={styles.phoneText}>{"+63" + phoneNumber}</Text>
    </View>
  </View>
  
  <View style={styles.inputWrapper}>
  <Text style={styles.inputLabel}>First Name</Text>
  <View style={styles.input}>
    <Image 
      source={require('../../assets/iconuser.png')} // Replace with the correct path to your image
      style={styles.inputImage} 
    />
    <TextInput
      placeholder="Enter your first name"
      placeholderTextColor="#A0A0A0"
      value={firstName}
      onChangeText={setFirstName}
      style={styles.textInput}
    />
  </View>
</View>
          
<View style={styles.inputWrapper}>
  <Text style={styles.inputLabel}>Last Name</Text>
  <View style={styles.input}>
    <Image 
      source={require('../../assets/iconuser.png')} // Replace with the correct path to your image
      style={styles.inputImage} 
    />
    <TextInput
      placeholder="Enter your last name"
      placeholderTextColor="#A0A0A0"
      value={lastName}
      onChangeText={setLastName}
      style={styles.textInput}
    />
  </View>
</View>
        </View>
        
        <TouchableOpacity 
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#000000', '#000000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Register Now</Text>
                <MaterialIcons name="arrow-forward" size={20} color="white" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  inputImage: {
    width: 20, 
    height: 20, 
    marginRight: 12,
    resizeMode: 'contain',
  },
  
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  logoImage: {
    width: 110, 
    height: 100, 
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 30, 
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
  },
  inputsContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  phoneText: {
    fontSize: 16,
    color: '#666666',
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 56,
    
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  footerLink: {
    color: '#4776E6',
    fontWeight: '600',
  },
  toastContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 100,
    elevation: 5,
  },
  toastContent: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 4,
  },
  toastText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  }
});

export default RegisterScreen;