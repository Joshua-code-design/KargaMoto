import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Responsive Dimensions
const { width, height } = Dimensions.get('window');

// Responsive Design Helper Functions
const responsiveWidth = (w) => width * (w / 375); // Based on iPhone 12 Pro width
const responsiveHeight = (h) => height * (h / 812); // Based on iPhone 12 Pro height
const responsiveFontSize = (f) => Math.round(width * (f / 375)); // Responsive font scaling

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

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '+1 (555) 123-4567',
    gender: 'Male'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderInputField = (label, field, icon, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <View style={styles.inputIconContainer}>
        <Icon name={icon} size={responsiveFontSize(24)} color={COLORS.tertiary} />
      </View>
      <View style={styles.inputTextContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          value={formData[field]}
          onChangeText={(value) => handleInputChange(field, value)}
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor={COLORS.placeholder}
          keyboardType={keyboardType}
          returnKeyType="done"
          blurOnSubmit={true}
        />
      </View>
    </View>
  );

  const renderGenderSelection = () => (
    <View style={styles.genderContainer}>
      <Text style={styles.inputLabel}>Gender</Text>
      <View style={styles.genderButtonGroup}>
        {['Male', 'Female', 'Other'].map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[
              styles.genderButton,
              formData.gender === gender && styles.genderButtonActive
            ]}
            onPress={() => handleInputChange('gender', gender)}
          >
            <Text 
              style={[
                styles.genderButtonText,
                formData.gender === gender && styles.genderButtonTextActive
              ]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon 
            name="arrow-left" 
            size={responsiveFontSize(24)} 
            color={COLORS.primary} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <Icon 
                name="account-circle" 
                size={responsiveWidth(100)} 
                color={COLORS.tertiary} 
              />
            </View>
          </View>

          {renderInputField('Full Name', 'fullName', 'account-outline')}
          {renderInputField('Phone Number', 'phoneNumber', 'phone-outline', 'phone-pad')}
          
          {renderGenderSelection()}

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(20),
    paddingVertical: responsiveHeight(15),
    backgroundColor: COLORS.background,
    borderBottomColor: COLORS.inputBorder
  },
  backButton: {
    marginRight: responsiveWidth(15)
  },
  headerTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1
  },
  scrollViewContent: {
    flexGrow: 1
  },
  container: {
    padding: responsiveWidth(20)
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: responsiveHeight(30)
  },
  profileImageWrapper: {
    width: responsiveWidth(120),
    height: responsiveWidth(120),
    borderRadius: responsiveWidth(60),
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editImageButton: {
    position: 'absolute',
    bottom: -responsiveHeight(10),
    right: width / 2 - responsiveWidth(70),
    backgroundColor: COLORS.tertiary,
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(20),
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.inputBorder
  },
  inputIconContainer: {
    padding: responsiveWidth(15),
    borderRightWidth: 1,
    borderRightColor: COLORS.inputBorder
  },
  inputTextContainer: {
    flex: 1,
    paddingLeft: responsiveWidth(15)
  },
  inputLabel: {
    fontSize: responsiveFontSize(12),
    color: COLORS.text,
    marginBottom: 5
  },
  input: {
    fontSize: responsiveFontSize(16),
    color: COLORS.text,
    paddingVertical: Platform.OS === 'ios' ? responsiveHeight(10) : 0
  },
  genderContainer: {
    marginBottom: responsiveHeight(20)
  },
  genderButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  genderButton: {
    flex: 1,
    paddingVertical: responsiveHeight(12),
    marginHorizontal: responsiveWidth(5),
    backgroundColor: COLORS.background,
    borderRadius: 10,
    alignItems: 'center'
  },
  genderButtonActive: {
    backgroundColor: COLORS.tertiary
  },
  genderButtonText: {
    color: COLORS.text,
    fontWeight: '500',
    fontSize: responsiveFontSize(14)
  },
  genderButtonTextActive: {
    color: COLORS.white
  },
  saveButton: {
    backgroundColor: COLORS.tertiary,
    paddingVertical: responsiveHeight(15),
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(16),
    fontWeight: '600'
  }
});