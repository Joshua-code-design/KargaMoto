import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Color Palette with Improved Contrast
const COLORS = {
  primary: '#1A2B4D',
  secondary: '#2E7D32',
  tertiary: '#26A69A',
  background: '#F5F5F5',
  white: '#FFFFFF',
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  text: '#333333',
  placeholder: '#888888'
};

const FeedbackForm = () => {
  const [city, setCity] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(true);

  // Responsive screen dimensions
  const { width, height } = Dimensions.get('window');

  // Mock data for dropdown options
  const cities = ['Select City...', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const serviceTypes = ['Select Service Type...', 'Installation', 'Repair', 'Consultation', 'Upgrade'];
  const problemTypes = ['Select Problem...', 'App Crash', 'Login Issues', 'Performance', 'Feature Request', 'Other'];

  const handleSubmit = () => {
    // Validate form before submission
    if (!city || !serviceType || !problemType || !description) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Handle form submission logic here
    console.log({ city, serviceType, problemType, description });
    // Close modal after submission
    setModalVisible(false);
  };

  const createStyles = (width, height) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: width * 0.95,
      maxHeight: height * 0.95,
      backgroundColor: COLORS.white,
      borderRadius: 10,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        },
        android: {
          elevation: 5,
        },
      }),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: COLORS.primary,
    },
    headerTitle: {
      fontSize: width * 0.045,
      fontWeight: 'bold',
      color: COLORS.white,
    },
    closeButton: {
      fontSize: width * 0.05,
      fontWeight: 'bold',
      color: COLORS.white,
    },
    formContainer: {
      padding: width * 0.05,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logoText: {
      fontSize: width * 0.1,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    subTitle: {
      fontSize: width * 0.04,
      fontWeight: '500',
      marginTop: 5,
      color: COLORS.text,
    },
    messageText: {
      fontSize: width * 0.035,
      lineHeight: width * 0.06,
      marginBottom: 20,
      color: COLORS.text,
    },
    label: {
      fontSize: width * 0.035,
      fontWeight: '500',
      marginBottom: 5,
      marginTop: 10,
      color: COLORS.text,
    },
    required: {
      color: 'red',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: COLORS.inputBorder,
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: COLORS.inputBackground,
    },
    picker: {
      height: height * 0.06,
    },
    textInput: {
      borderWidth: 1,
      borderColor: COLORS.inputBorder,
      borderRadius: 5,
      padding: 10,
      height: height * 0.1,
      marginBottom: 15,
      backgroundColor: COLORS.inputBackground,
      textAlignVertical: 'top',
      color: COLORS.text,
    },
    attachmentButton: {
      borderWidth: 1,
      borderColor: COLORS.inputBorder,
      borderRadius: 5,
      padding: 15,
      marginBottom: 20,
      backgroundColor: COLORS.background,
    },
    attachmentButtonText: {
      color: COLORS.placeholder,
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: COLORS.secondary,
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 30,
    },
    submitButtonText: {
      color: COLORS.white,
      fontWeight: 'bold',
      fontSize: width * 0.04,
    },
  });

  // Create styles dynamically based on screen dimensions
  const styles = createStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Feedback</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.formContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>KM</Text>
                <Text style={styles.subTitle}>App Issue Report</Text>
              </View>
              
              <Text style={styles.messageText}>
                Dear User,{'\n\n'}
                Thank you for reporting the issue with the KARGAMOTO App. We apologize for any inconvenience caused and are working to resolve the issue.{'\n\n'}
                Please provide specific details about the problem to help us improve our services.{'\n'}
                Thank you for your patience.{'\n\n'}
                Best, KM Support Team
              </Text>
              
              <Text style={styles.label}>City<Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={city}
                  onValueChange={(itemValue) => setCity(itemValue)}
                  style={styles.picker}
                  itemStyle={{ color: COLORS.text }}
                >
                  {cities.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item} 
                      value={item === 'Select City...' ? '' : item} 
                      color={item === 'Select City...' ? COLORS.placeholder : COLORS.text}
                    />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.label}>Service Type<Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={serviceType}
                  onValueChange={(itemValue) => setServiceType(itemValue)}
                  style={styles.picker}
                  itemStyle={{ color: COLORS.text }}
                >
                  {serviceTypes.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item} 
                      value={item === 'Select Service Type...' ? '' : item}
                      color={item === 'Select Service Type...' ? COLORS.placeholder : COLORS.text}
                    />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.label}>Problem Encountered<Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={problemType}
                  onValueChange={(itemValue) => setProblemType(itemValue)}
                  style={styles.picker}
                  itemStyle={{ color: COLORS.text }}
                >
                  {problemTypes.map((item, index) => (
                    <Picker.Item 
                      key={index} 
                      label={item} 
                      value={item === 'Select Problem...' ? '' : item}
                      color={item === 'Select Problem...' ? COLORS.placeholder : COLORS.text}
                    />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.label}>Description of the issue<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="What's the problem?"
                placeholderTextColor={COLORS.placeholder}
                value={description}
                onChangeText={setDescription}
                multiline={true}
              />
              
              <Text style={styles.label}>Attachment (If Applicable)</Text>
              <TouchableOpacity style={styles.attachmentButton}>
                <Text style={styles.attachmentButtonText}>Screenshot / Recording</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FeedbackForm;