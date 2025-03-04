import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    contentContainer: {
      paddingHorizontal: 24,
      marginTop: 80,
      alignItems: 'center',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 12,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
      lineHeight: 20,
      maxWidth: '80%',
      marginBottom: 30,
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    otpBox: {
      width: 45,
      height: 45,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 20,
      marginHorizontal: 6,
      backgroundColor: 'white',
      color: '#000',
    },
    otpBoxSuccess: {
      width: 45,
      height: 45,
      borderWidth: 1,
      borderColor: '#4CAF50',
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 20,
      marginHorizontal: 6,
      backgroundColor: 'rgba(76, 175, 80, 0.05)',
      color: '#4CAF50',
    },
    otpBoxError: {
      width: 45,
      height: 45,
      borderWidth: 1,
      borderColor: '#F44336',
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 20,
      marginHorizontal: 6,
      backgroundColor: 'rgba(244, 67, 54, 0.05)',
      color: '#F44336',
    },
    resendText: {
      color: '#1E88E5',
      marginTop: 20,
      textAlign: 'center',
    },
    disabledText: {
      color: '#9E9E9E',
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 40,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 25,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: '80%',
    },
    nextButton: {
      backgroundColor: '#1E88E5',
    },
    nextButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    // Toast styles
    toastContainer: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      zIndex: 9999,
      alignItems: 'center',
    },
    toastContent: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      minWidth: '80%',
      maxWidth: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    },
    iconContainer: {
      marginRight: 12,
    },
    toastMessage: {
      fontSize: 14,
      color: '#333',
      flex: 1,
      fontWeight: '500',
    }
  });
  

export default styles;