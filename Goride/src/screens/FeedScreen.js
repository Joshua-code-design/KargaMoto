import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker'; // For file attachments
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Color Palette with Improved Contrast
const COLORS = {
  primary: '#1A2B4D',       // Deep Navy Blue
  secondary: '#2E7D32',     // Forest Green
  tertiary: '#26A69A',      // Soft Teal
  background: '#F5F5F5',    // Light Gray
  white: '#FFFFFF',         // White
  inputBackground: '#FFFFFF',
  inputBorder: '#E0E0E0',
  text: '#333333',
  placeholder: '#888888'
};

const FeedScreen = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);

  // Responsive screen dimensions with orientation support
  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  // Mock data for dropdown options
  const cities = ['Select City', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const serviceTypes = ['Select Service Type', 'Installation', 'Repair', 'Consultation', 'Upgrade'];
  const problemTypes = ['Select Problem Type', 'App Crash', 'Login Issues', 'Performance', 'Feature Request', 'Other'];

  // Dynamic responsive styles
  const createStyles = (width, height, isPortrait) => {
    const responsiveFont = (size) => {
      const standardScreenHeight = 680; // iPhone SE or similar
      const scaleFactor = height / standardScreenHeight;
      return size * scaleFactor;
    };

    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORS.background,
      },
      gradientHeader: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.02,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      headerTitle: {
        color: COLORS.white,
        fontSize: responsiveFont(18),
        fontWeight: '700',
      },
      scrollContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
      },
      formSection: {
        marginBottom: height * 0.02,
      },
      dear: {
       marginTop: hp(2),
      },
      title:{
      fontSize: responsiveFont(18),
      fontWeight: 600,
      marginBottom: hp(1),
      },
      dearText:{
      fontSize: responsiveFont(15),
      marginBottom: hp(1),
      },
      textTwo:{
      fontSize: responsiveFont(15),
      marginBottom: hp(1),
      },

      label: {
        color: COLORS.text,
        fontSize: responsiveFont(16),
        fontWeight: '600',
        marginBottom: 10,
      },
      pickerContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 15,
        overflow: 'hidden',
        height: height * (isPortrait ? 0.07 : 0.1),
      },
      picker: {
        height: '100%',
        width: '100%',
      },
      textInput: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        height: height * (isPortrait ? 0.15 : 0.2),
        textAlignVertical: 'top',
        fontSize: responsiveFont(16),
        color: COLORS.text,
      },
      submitButton: {
        backgroundColor: COLORS.tertiary,
        borderRadius: 10,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        marginTop: height * 0.02,
        flexDirection: 'row',
        justifyContent: 'center',
      },
      submitButtonText: {
        color: COLORS.white,
        fontSize: responsiveFont(18),
        fontWeight: '700',
        marginRight: 10,
      },
      attachmentButton: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingVertical: height * 0.02,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: height * 0.02,
      },
      attachmentButtonText: {
        color: COLORS.text,
        fontSize: responsiveFont(16),
        marginLeft: 10,
      },
      attachmentText: {
        color: COLORS.secondary,
        fontSize: responsiveFont(14),
        marginTop: 10,
      },
      image:{
      width: hp(13),
      height: hp(13),
      alignSelf: 'center',
      borderRadius: hp(50),
      }
      
    });
  };

  const styles = createStyles(width, height, isPortrait);

  // File attachment handler
  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setAttachment(result);
      }
    } catch (err) {
      console.error('Document picker error:', err);
      Alert.alert('Error', 'Unable to pick document');
    }
  }, []);

  const handleSubmit = () => {
    // Validate form before submission
    if (!city || !serviceType || !problemType || !description) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    
    // Handle form submission logic
    const submissionData = {
      city, 
      serviceType, 
      problemType, 
      description,
      attachment: attachment ? attachment.name : null
    };

    console.log(submissionData);
    // Add your actual submission logic here
    Alert.alert('Success', 'Feedback submitted successfully');
  };

  // Orientation change listener
  React.useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      // You can add any specific orientation change handling here
    };

    Dimensions.addEventListener('change', updateLayout);
    return () => {
      // Clean up listener if needed
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, COLORS.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      >
        <Text style={styles.headerTitle}></Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.tertiary} />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.formSection}>
            <Image source={require('../../assets/Habal.png')}
            style={styles.image}/>

            {/* Paragraph */}
          <View style={styles.dear}>
            <Text style={styles.title}>Dear User</Text>

            <Text style={styles.dearText}>Thank you For reporting the issue with the Angkas App. We apologize for any inconvenience caused and are 
            working to recieve it. </Text>

            <Text style={styles.textTwo}>Please provide specific details about the problem to help us 
            improve our services Thank you for your patiencs </Text>
          </View>

            {/* City Picker */}
            <Text style={styles.label}>
              City <Text style={{ color: COLORS.error }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={city}
                onValueChange={(itemValue) => setCity(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                {cities.map((item, index) => (
                  <Picker.Item 
                    key={index} 
                    label={item} 
                    value={item === 'Select City' ? '' : item} 
                  />
                ))}
              </Picker>
            </View>

            {/* Service Type Picker */}
            <Text style={styles.label}>
              Service Type <Text style={{ color: COLORS.error }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={serviceType}
                onValueChange={(itemValue) => setServiceType(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                {serviceTypes.map((item, index) => (
                  <Picker.Item 
                    key={index} 
                    label={item} 
                    value={item === 'Select Service Type' ? '' : item} 
                  />
                ))}
              </Picker>
            </View>

            {/* Problem Type Picker */}
            <Text style={styles.label}>
              Problem Type <Text style={{ color: COLORS.error }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={problemType}
                onValueChange={(itemValue) => setProblemType(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                {problemTypes.map((item, index) => (
                  <Picker.Item 
                    key={index} 
                    label={item} 
                    value={item === 'Select Problem Type' ? '' : item} 
                  />
                ))}
              </Picker>
            </View>

            {/* Description Input */}
            <Text style={styles.label}>
              Description <Text style={{ color: COLORS.error }}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your issue in detail"
              placeholderTextColor={COLORS.subtext}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
            />

            {/* Attachment Button */}
            <TouchableOpacity 
              style={styles.attachmentButton} 
              onPress={pickDocument}
            >
              <Ionicons name="attach" size={20} color={COLORS.text} />
              <Text style={styles.attachmentButtonText}>Add Attachment</Text>
            </TouchableOpacity>
            {attachment && (
              <Text style={styles.attachmentText}>
                Attached: {attachment.name}
              </Text>
            )}

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
              <Ionicons name="send" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FeedScreen;