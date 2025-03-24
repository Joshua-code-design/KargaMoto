import { StyleSheet, Dimensions, Platform } from 'react-native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Responsive sizing helper functions
const wp = (percentage) => {
  return width * (percentage / 100);
};

const hp = (percentage) => {
  return height * (percentage / 100);
};

// Design system constants
const COLORS = {
  primary: '#2C3E50',
  secondary: '#3498DB',
  background: '#FFFFFF',
  inputBg: '#F8F8F8',
  inputBorder: '#E0E0E0',
  inputBorderFocused: '#3498DB',
  text: '#333333',
  textLight: '#777777',
  buttonGradientStart: '#3498DB',
  buttonGradientEnd: '#2C3E50',
  success: '#2ECC71',
  error: '#E74C3C',
};

const SPACING = {
  xs: wp(2),
  sm: wp(3),
  md: wp(4),
  lg: wp(5),
  xl: wp(7),
};

const FONT_SIZE = {
  xs: wp(3),
  sm: wp(3.5),
  md: wp(4),
  lg: wp(4.5),
  xl: wp(5),
  xxl: wp(7),
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    width: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.6,
  },
  logoText: {
    marginTop: hp(8),
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    letterSpacing: 4,
    color: COLORS.primary,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(5),
    width: '100%',
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.sm,
    borderWidth: 1,
    height: hp(10),
    width: wp(23),
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.inputBg,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  flag: {
    width: wp(7),
    height: hp(2.3),
    marginRight: SPACING.xs,
    borderRadius: 2,
  },
  callingCode: {
    fontSize: FONT_SIZE.md,
    fontWeight: "bold",
    color: COLORS.text,
  },
  numberInputContainer: {
    flex: 1,
    position: "relative",
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  focusedInput: {
    borderColor: COLORS.inputBorderFocused,
    borderWidth: 1.5,
  },
  // Improved floating label
  floatingLabel: {
    position: "absolute",
    left: SPACING.sm,
    top: -SPACING.xs,
    color: COLORS.textLight,
    fontSize: FONT_SIZE.xs,
    paddingHorizontal: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    zIndex: 1,
    letterSpacing: 0.5,
    fontWeight: '500',
    transform: [{ translateY: hp(0.6) }] 
  },
  floatingLabelFocused: {
    color: COLORS.inputBorderFocused,
    fontWeight: '600',
  },
  input: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    color: COLORS.text,
    paddingVertical: SPACING.xs,
    paddingTop: SPACING.sm, // Add padding to accommodate the floating label
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
    backgroundColor: 'transparent',
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    lineHeight: FONT_SIZE.lg,
    textAlign: 'left',
  },
  // Improved button design
  button: {
    height: hp(6.5),
    width: "100%",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: hp(4),
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonGradient: {
    borderRadius: 12,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: SPACING.sm,
  },
  loadingDots: {
    flexDirection: 'row',
    marginLeft: SPACING.sm,
    alignItems: 'center',
  },
  dot: {
    width: wp(1),
    height: wp(1),
    borderRadius: wp(0.5),
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },
  dot1: {
    opacity: 0.6,
    animationName: 'dotAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0s',
  },
  dot2: {
    opacity: 0.8,
    animationName: 'dotAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0.2s',
  },
  dot3: {
    opacity: 1,
    animationName: 'dotAnimation',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationDelay: '0.4s',
  },
  toast: {
    position: 'absolute',
    top: hp(5),
    alignSelf: 'center',
    zIndex: 9999,
    width: '90%',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  iconContainer: {
    width: wp(7),
    height: wp(7),
    borderRadius: wp(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  successIcon: {
    backgroundColor: COLORS.success,
  },
  errorIcon: {
    backgroundColor: COLORS.error,
  },
  toastMessage: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  }
});

export default styles;