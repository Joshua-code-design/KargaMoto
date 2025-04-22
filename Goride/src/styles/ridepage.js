import { StyleSheet, Dimensions, Platform, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


// Responsive font size function
const responsiveFontSize = (fontSize) => {
  const standardScreenHeight = 680;
  const standardScreenWidth = 360;
  
  const heightPercent = (fontSize * SCREEN_HEIGHT) / standardScreenHeight;
  const widthPercent = (fontSize * SCREEN_WIDTH) / standardScreenWidth;
  
  return Math.round(Math.min(heightPercent, widthPercent));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Added background color for consistency
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,

  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('10%'),
    height: hp('10%'), // Reduced from 20% for better responsiveness
    paddingTop: Platform.OS === 'android' 
      ? (StatusBar.currentHeight || hp('2%')) 
      : hp('4%'),
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: wp('5%'), // Changed from hp to wp for consistent spacing
    width: wp('8%'),
    height: wp('8%'),
  },
  logoText: {
    fontWeight: '700',
    fontSize: responsiveFontSize(16),
  },
  menuButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' 
      ? hp('10%') 
      : hp('8%'), // Adjusted for better cross-platform consistency
  },
  walletCard: {
    overflow: 'hidden',
    borderRadius: 16, 
    marginHorizontal: wp('3%'), 
    marginTop: hp('20%')
  },
  walletContent: {
    padding: wp('5%'),
  },
  walletHeader: {
    marginBottom: hp('1%'), // Slightly reduced margin
  },
  walletTitle: {
    fontWeight: '500',
    fontSize: responsiveFontSize(14),
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    fontWeight: '700',
    fontSize: responsiveFontSize(18),
  },
  depositButton: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'), // Slightly reduced vertical padding
    borderRadius: 24,
  },
  depositText: {
    fontWeight: '600',
    fontSize: responsiveFontSize(14),
  },
  walletIcon: {
    alignSelf: 'flex-end',
  },
  rideOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('1%'), // Added horizontal padding
  },
  rideOption: {
    flex: 1,
    height: hp('10%'), // Reduced from 10% for better responsiveness
    overflow: 'hidden',
    marginHorizontal: wp('1%'), // Added margin between options
    borderRadius: 12, // Added border radius
  },
  rideOptionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('4%'), // Reduced horizontal padding
  },
  rideIconContainer: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('2%'), // Reduced margin
  },
  rideOptionImage: {
    width: wp('10%'),
    height: wp('10%'),
  },
  rideTextContainer: {
    flex: 1,
  },
  rideOptionText: {
    fontWeight: '600',
    fontSize: responsiveFontSize(14),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
    paddingHorizontal: wp('4%'), // Added horizontal padding
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: responsiveFontSize(16),
  },
  seeAllButton: {
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
  },
  seeAllText: {
    fontWeight: '500',
    fontSize: responsiveFontSize(12),
  },
  recentScrollContent: {
    paddingVertical: hp('1%'),
  },
  recentItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('20%'), // Fixed width for consistent spacing
  },
  recentIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('12%'),
    height: wp('12%'),
  },
  recentText: {
    textAlign: 'center',
    marginTop: hp('0.5%'),
    fontSize: responsiveFontSize(12),
  },
  carouselContainer: {
    marginVertical: hp('1%'),
    paddingHorizontal: wp('4%'), // Added horizontal padding
  },
  carouselItemContainer: {
    position: 'relative',
    width: wp('92%'), // Adjusted to match padding
    height: hp('20%'), // Fixed height with percentage
    borderRadius: 12, // Added border radius
    overflow: 'hidden',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures image covers entire container
  },
  carouselGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp('4%'),
    height: '50%',
    justifyContent: 'flex-end',
  },
  carouselTitle: {
    fontWeight: '700',
    marginBottom: hp('0.5%'),
    fontSize: responsiveFontSize(16),
  },
  carouselDescription: {
    fontWeight: '400',
    fontSize: responsiveFontSize(14),
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('1.5%'), // Reduced vertical padding
    marginBottom: hp('2%'),
    marginHorizontal: wp('4%'),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? hp('2.5%') : hp('1.5%'),
    shadowColor: '#000', // Added shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: wp('3%'), // Reduced horizontal padding
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: wp('1.5%'),
    height: wp('1.5%'),
    borderRadius: wp('0.75%'),
  },
  navText: {
    marginTop: hp('0.5%'),
    fontSize: responsiveFontSize(12),
  },
});

export default styles;