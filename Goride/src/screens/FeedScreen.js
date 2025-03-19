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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FeedbackForm = () => {
  const [city, setCity] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(true);

  // Mock data for dropdown options
  const cities = ['Select City...', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const serviceTypes = ['Select Service Type...', 'Installation', 'Repair', 'Consultation', 'Upgrade'];
  const problemTypes = ['Select Problem...', 'App Crash', 'Login Issues', 'Performance', 'Feature Request', 'Other'];

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({ city, serviceType, problemType, description });
    // Close modal after submission
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Feedback</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContainer}>
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
                  style={styles.picker}>
                  {cities.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item === 'Select City...' ? '' : item} />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.label}>Service Type<Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={serviceType}
                  onValueChange={(itemValue) => setServiceType(itemValue)}
                  style={styles.picker}>
                  {serviceTypes.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item === 'Select Service Type...' ? '' : item} />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.label}>Problem Encountered<Text style={styles.required}>*</Text></Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={problemType}
                  onValueChange={(itemValue) => setProblemType(itemValue)}
                  style={styles.picker}>
                  {problemTypes.map((item, index) => (
                    <Picker.Item key={index} label={item} value={item === 'Select Problem...' ? '' : item} />
                  ))}
                </Picker>
              </View>
              
              <Text style={styles.label}>Description of the issue<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.textInput}
                placeholder="What's the problem?"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
  },
  required: {
    color: 'red',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    height: 40,
    marginBottom: 15,
  },
  attachmentButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  attachmentButtonText: {
    color: '#888',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FeedbackForm;