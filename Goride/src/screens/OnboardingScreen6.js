import React, { useState } from 'react';
import axios from 'axios';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister = async () => {
    if (!username || !lastName || !phone) {
      Alert.alert('Missing Information', 'Please fill in all fields to continue.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const fullname = `${username} ${lastName}`;
      const response = await axios.post('http://192.168.1.26:5000/api/register', {
        full_name: fullname,
        phone_number: phone
      });
      
      setIsLoading(false);
      
      if (response.status === 200) {
        Alert.alert('Success', 'Your account has been created successfully!');
        // Clear form after successful registration
        setUsername('');
        setLastName('');
        setPhone('');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Registration Failed', 
        error.response?.data?.error || 'Please check your connection and try again.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.titlePrimary}>Create Account</Text>
            <Text style={styles.titleSecondary}>Join our community today</Text>
          </View>
          
          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#666666"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#666666"
                value={username}
                onChangeText={setUsername}
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#666666"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#4776E6', '#8E54E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Processing...' : 'Register Now'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.footerLink}>Sign In</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoid: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
  },
  titlePrimary: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  titleSecondary: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  inputsContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4776E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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