import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      padding: width * 0.05,
      backgroundColor: "#FFFFFF",
      width: '100%',
      
    },
    backgroundImage: {
      position: 'absolute',
      width: width,
      height: height,
      opacity: 0.6,
    },
    logoText: {
      marginTop: 80,
      fontSize: 50,
      fontWeight: 'bold',
      letterSpacing: 4,
      color: '#2c3e50',
      alignItems: 'left',
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: height * 0.05,
      width: '100%',
    },
    countryContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: width * 0.025,
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 12,
      marginRight: 10,
      backgroundColor: "#F8F8F8",
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    flag: {
      width: width * 0.070,
      height: height * 0.023,
      marginRight: 5,
      borderRadius: 2,
    },
    callingCode: {
      fontSize: width * 0.04,
      fontWeight: "bold",
      color: "#000000",
    },
    numberInputContainer: {
      flex: 1,
      position: "relative",
      borderWidth: 1,
      borderColor: "#E0E0E0",
      borderRadius: 12,
      paddingHorizontal: width * 0.03,
      paddingVertical: width * 0.025,
      backgroundColor: "#FFFFFF",
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
    },
    focusedInput: {
      borderColor: "black",
      borderWidth: 1.8,
    },
    floatingLabel: {
      position: "absolute",
      left: 10,
      color: "#000000",
      paddingHorizontal: 8,
      backgroundColor: "#FFFFFF",
      borderRadius: 4,
      marginTop: 4,
      zIndex: 1,
      letterSpacing: 0.3,
    },
    input: {
      fontSize: width * 0.045,
      fontWeight: "500",
      color: "#000000",
      paddingVertical: 2,
    },
    footerText: {
      fontSize: width * 0.050,
      backgroundColor:'white',
      color: "#555555",
      marginTop: 5,
      lineHeight: width * 0.06,
      textAlign: 'left',
    },
    button: {
      height: height * 0.07,
      width: "100%",
      backgroundColor: "black",
      borderRadius: 50, 
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      marginTop: height * 0.05,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    buttonLoading: {
      backgroundColor: "#333333",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: width * 0.045,
      fontWeight: "600",
      letterSpacing: 0.5,
    },
    buttonIcon: {
      marginLeft: 8,
    },
    loadingDots: {
      flexDirection: 'row',
      marginLeft: 8,
      alignItems: 'center',
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
      marginHorizontal: 2,
    },
    dot1: {
      opacity: 0.6,
    },
    dot2: {
      opacity: 0.8,
    },
    dot3: {
      opacity: 1,
    },
    toast: {
      position: 'absolute',
      top: height * 0.05,
      alignSelf: 'center',
      zIndex: 9999,
      width: '90%',
    },
    toastContent: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 6,
    },
    iconContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    successIcon: {
      backgroundColor: '#4CAF50',
    },
    errorIcon: {
      backgroundColor: '#F44336',
    },
    toastMessage: {
      fontSize: 18,
      fontWeight: '500',
      color: '#333333',
      flex: 1,
    }
  });
  

export default styles;