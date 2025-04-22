import { StyleSheet, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const COLORS = {
  primary: '#1A2B4D',       // Deep Navy Blue
  secondary: '#2E7D32',     // Forest Green
  tertiary: '#26A69A',      // Soft Teal
  accent: '#D4AF37',        // Muted Gold
  background: '#F5F5F5',    // Light Gray
  white: '#FFFFFF',         // White
  lightGray: '#E0E0E0',     // Very Light Gray
  darkGray: '#333333',      // Charcoal Gray
  error: '#E53935',         // Bright Red
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tertiary,
  },
  contentContainer: {
    position: 'absolute',
    top: '62%',
    paddingHorizontal: width * 0.06,
    width: '100%',
  },
  titleContainer:{
    marginTop: hp('10%'),
    padding: wp('5%'),
    gap: hp('2%')
  },
  title:{
   fontSize: wp('5'),
   color: COLORS.darkGray,
   fontFamily: 'Poppins-Bold', 
  },
  subtitle:{
   fontSize: wp('5'),
   color: COLORS.darkGray,
   fontFamily: 'Courier',
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
    backgroundColor: '#666666',
    margin: width * 0.01,
  },
  radioButtonActive: {
    backgroundColor: COLORS.white,
    width: width * 0.025,
    height: width * 0.025,
    borderRadius: width * 0.0125,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: height * 0.05,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: width * 0.06,
    justifyContent: 'center',
  },
  button: {
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
    borderRadius: width * 0.06,
    elevation: 3,
    shadowColor: COLORS.white,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minWidth: width * 0.3,
  },
  nextButton: {
    backgroundColor: COLORS.white,
  },
  nextButtonText: {
    color: COLORS.darkGray,
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
