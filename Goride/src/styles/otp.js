import { StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Normalize function to scale sizes across different devices
const normalize = (size) => {
  const scale = width / 375; // Base width scaling (iPhone 8 width)
  const newSize = size * scale;
  
  // Different scaling for iOS and Android
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Calculate responsive dimensions
const isSmallDevice = width < 375;
const isTablet = width > 600;
const isLargeTablet = width > 900;

// Helper for responsive margin, padding based on screen size
const responsive = {
  padding: isTablet ? normalize(40) : normalize(40),
  margin: isTablet ? normalize(30) : normalize(20),
  buttonHeight: isTablet ? normalize(60) : normalize(48),
  // Reduced input size for smaller OTP boxes
  inputSize: isTablet ? normalize(50) : normalize(50),
  inputMargin: isTablet ? normalize(8) : normalize(5),
  fontSize: {
    title: isTablet ? normalize(28) : normalize(22),
    description: isTablet ? normalize(16) : normalize(14),
    // Slightly smaller font size for input
    input: isTablet ? normalize(20) : normalize(16),
    button: isTablet ? normalize(18) : normalize(16),
    toast: isTablet ? normalize(16) : normalize(14),
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingHorizontal: responsive.padding,
    marginTop: hp(10), // Relative to screen height
    alignItems: 'center',
  },
  title: {
    fontSize: responsive.fontSize.title,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: responsive.margin / 2,
    textAlign: 'center',
  },
  description: {
    fontSize: responsive.fontSize.description,
    color: '#666',
    textAlign: 'center',
    lineHeight: responsive.fontSize.description * 1.4,
    maxWidth: isTablet ? '70%' : '80%',
    marginBottom: responsive.margin * 1.5,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(100),
  },
  otpBox: {
    width: responsive.inputSize,
    height: responsive.inputSize,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: normalize(8),
    textAlign: 'center',
    fontSize: responsive.fontSize.input, 
    marginHorizontal: responsive.inputMargin,
    backgroundColor: 'white',
    color: '#000',
  },
  otpBoxSuccess: {
    width: responsive.inputSize,
    height: responsive.inputSize,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: normalize(8),
    textAlign: 'center',
    fontSize: responsive.fontSize.input,
    marginHorizontal: responsive.inputMargin,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
    color: '#4CAF50',
  },
  otpBoxError: {
    width: responsive.inputSize,
    height: responsive.inputSize,
    borderWidth: 1,
    borderColor: '#F44336',
    borderRadius: normalize(8),
    textAlign: 'center',
    fontSize: responsive.fontSize.input,
    marginHorizontal: responsive.inputMargin,
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
    color: '#F44336',
  },
  resendText: {
    color: '#1E88E5',
    marginTop: responsive.margin,
    textAlign: 'center',
    fontSize: responsive.fontSize.description,
  },
  disabledText: {
    color: '#9E9E9E',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.05, // Relative to screen height
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: responsive.padding,
  },
  // Additional button container for when keyboard is visible on iOS
  keyboardVisibleButtonContainer: {
    width: wp(100),
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: responsive.padding,
    marginTop: responsive.margin * 2,
    marginBottom: responsive.margin * 2,
  },
  button: {
    paddingVertical: normalize(14),
    borderRadius: normalize(25),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: isTablet ? '60%' : '80%',
    height: responsive.buttonHeight,
    justifyContent: 'center',
  },
  nextButton: {
    backgroundColor: '#000',
  },
  nextButtonText: {
    color: 'white',
    fontSize: responsive.fontSize.button,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Toast styles
  toastContainer: {
    position: 'absolute',
    top: height * 0.075, // Relative to screen height
    left: responsive.padding,
    right: responsive.padding,
    zIndex: 9999,
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    minWidth: isTablet ? '60%' : '80%',
    maxWidth: isTablet ? '70%' : '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  iconContainer: {
    marginRight: normalize(12),
  },
  toastMessage: {
    fontSize: responsive.fontSize.toast,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
});

export default styles;