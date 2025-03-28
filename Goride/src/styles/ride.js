import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#2C3E50',      // Deep navy blue
  secondary: '#3498DB',    // Bright blue
  background: '#F4F6F9',   // Light gray-blue
  text: '#333333',         // Dark gray
  accent: '#27AE60',       // Green
  white: '#FFFFFF',
  gray: '#7F8C8D',
  lightGray: '#ECF0F1',
  tertiary: '#26A69A' ,    
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingVertical: 15,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: colors.tertiary,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  mapPreview: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    width: wp(100),
    height: hp(30),
    opacity: 10,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: height * 0.03,
    paddingHorizontal: width * 0.05,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: height * 0.025,
  },
  locationIconContainer: {
    width: width * 0.1,
    alignItems: 'center',
    marginRight: 15,
    paddingTop: 20,
  },
  pickupDot: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  locationLine: {
    width: 2,
    backgroundColor: colors.lightGray,
    marginVertical: 5,
  },
  destinationDot: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputActive: {
    borderColor: colors.tertiary,
    backgroundColor: colors.white,
  },
  inputLabel: {
    color: colors.gray,
    marginBottom: 5,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    width: hp(30)
    
  },
  inputText: {
    color: colors.text,
    fontWeight: '600',
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.tertiary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  dropdownTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  dropdownItemText: {
    color: colors.text,
    fontWeight: '600',
  },
  dropdownItemSubtext: {
    color: colors.gray,
    marginTop: 3,
  },
  recentLocations: {
    marginTop: height * 0.02,
  },
  recentTitle: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: height * 0.015,
    fontSize: 18,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  recentTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  footer: {
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: width * 0.05,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButton: {
    backgroundColor: colors.tertiary,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  continueButtonText: {
    color: colors.white,
    fontWeight: '700',
    marginRight: 10,
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    marginTop: 10,
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  }
});

export default styles;