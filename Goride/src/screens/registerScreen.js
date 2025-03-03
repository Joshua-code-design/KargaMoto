import React, { useState } from 'react';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native'; // Added useNavigation import

import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  SafeAreaView
} from 'react-native';

const RegisterForm = () => {
  const route = useRoute(); 
  const { phoneNumber } = route.params; 
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation(); 

  const handleRegister = async () => {
    if (!username || !lastName) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullname = `${username} ${lastName}`;
      const response = await axios.post('http://192.168.1.27:5000/api/register-user', {
        full_name: fullname,
        phone_number: phoneNumber 
      });

      setIsLoading(false);
      
      if (response.status === 200) {
        Alert.alert('Success', 'Your account has been created successfully!');
        
        setUsername('');
        setLastName('');
        navigation.navigate('loginScreen'); 
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Registration Failed', 
        error.response?.data?.error || 'Please check your connection and try again.'
      );
    }
  };

  return ( // Fixed missing return statement
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titlePrimary}>Welcome, new user! Please register now to enjoy the services offered by Karga Moto.</Text>
        
        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#666666"
            keyboardType="phone-pad"
            value={"+63" + phoneNumber} 
            editable={false} 
          />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#666666"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#666666"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        
        <TouchableOpacity 
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Register Now'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerLink}>Sign In</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  formContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  titlePrimary: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  inputsContainer: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#333333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4776E6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
});

export default RegisterForm;