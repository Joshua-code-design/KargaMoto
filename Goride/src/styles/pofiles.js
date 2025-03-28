import { StyleSheet, Dimensions, Platform } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 600;

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

// Responsive scaling function
const normalize = (size, factor = 0.5) => {
  const scale = Math.min(
    wp(factor * 100),  // Width-based scaling
    hp(factor * 100)   // Height-based scaling
  );
  return Math.round(size * scale);
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'ios' ? hp('5%') : hp('3%'),
  },
  arrowContainer: {
    position: 'absolute',
    marginTop: hp('3%'),
    top: Platform.OS === 'ios' ? hp('5%') : hp('3%'),
    left: wp('4%'),
    zIndex: 1,
  },
  coverContainer: {
    height: hp('15%'),
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -hp('10%'),
  },
  profileImageWrapper: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.tertiary,
  },
  profileImage: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('12%'),
  },
  profileImagePlaceholder: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('12%'),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginTop: hp('2%'),
    alignItems: 'center',
  },
  userName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  userType: {
    fontSize: wp('4%'),
    color: COLORS.secondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: wp('3%'),
    marginHorizontal: wp('4%'),
    marginVertical: hp('1.5%'),
    padding: wp('4%'),
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: hp('1.5%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp('0.75%'),
  },
  infoLabel: {
    fontSize: wp('4%'),
    color: COLORS.darkGray,
  },
  infoValue: {
    fontSize: wp('4%'),
    color: COLORS.tertiary,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: hp('1.5%'),
  },
  settingsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingsButtonText: {
    marginLeft: wp('3%'),
    fontSize: wp('4%'),
    color: COLORS.darkGray,
    flex: 1,
  },
  actionButtonsContainer: {
    marginHorizontal: wp('4%'),
    marginTop: hp('3%'),
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
  },
  logoutButton: {
    backgroundColor: COLORS.tertiary,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: wp('4.5%'),
    marginLeft: wp('3%'),
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp('2%'),
    marginBottom: hp('2%'),
    marginHorizontal: wp('4%'),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? hp('3%') : hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: COLORS.white,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: wp('4%'),
  },
  activeIndicator: {
    position: 'absolute',
    top: -hp('1.5%'),
    width: wp('1%'),
    height: hp('0.5%'),
    borderRadius: wp('0.5%'),
    backgroundColor: COLORS.primary,
  },
  navText: {
    marginTop: hp('0.5%'),
    fontSize: wp('3.5%'),
    color: COLORS.darkGray,
  },
});