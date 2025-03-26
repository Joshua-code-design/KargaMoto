import { StyleSheet, Dimensions, Platform } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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

const scale = Math.min(width, height) / 375;
const normalize = (size) => Math.round(scale * size);

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
    paddingBottom: normalize(20),
  },
  arrowContainer: {
    position: 'absolute',
    top: normalize(10),
    left: normalize(10),
    zIndex: 10,
  },
  coverContainer: {
    height: normalize(150),
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -normalize(50),
  },
  profileImageWrapper: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.tertiary,
  },
  profileImage: {
    width: normalize(95),
    height: normalize(95),
    borderRadius: normalize(47.5),
  },
  profileImagePlaceholder: {
    width: normalize(95),
    height: normalize(95),
    borderRadius: normalize(47.5),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    marginTop: normalize(10),
    alignItems: 'center',
  },
  userName: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  userType: {
    fontSize: normalize(14),
    color: COLORS.secondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: normalize(10),
    marginHorizontal: normalize(15),
    marginVertical: normalize(10),
    padding: normalize(15),
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
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.darkGray,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: normalize(10),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: normalize(5),
  },
  infoLabel: {
    fontSize: normalize(14),
    color: COLORS.darkGray,
  },
  infoValue: {
    fontSize: normalize(14),
    color: COLORS.tertiary,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: normalize(10),
  },
  settingsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingsButtonText: {
    marginLeft: normalize(10),
    fontSize: normalize(14),
    color: COLORS.darkGray,
    flex: 1,
  },
  actionButtonsContainer: {
    marginHorizontal: normalize(15),
    marginTop: normalize(20),
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderRadius: normalize(10),
  },
  logoutButton: {
    backgroundColor: COLORS.tertiary,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: normalize(16),
    marginLeft: normalize(10),
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(2),
    marginBottom: hp(2),
    marginHorizontal: hp(4),
    borderRadius: 30,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 16,
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  navText: {
    marginTop: 4,
  },
}); 