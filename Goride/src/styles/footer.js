import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    footerBar: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
      borderRadius: 50,
      margin: 20,
      position: 'absolute',
      bottom: 0,
    },
    iconContainer: {
      paddingHorizontal: 20,
      marginLeft: 20,
      marginRight: 20,
    },
    centerLogoContainer: {
      position: 'absolute',
      left: '50%',
      transform: [{ translateX: -30 }], 
      backgroundColor: 'black',
      borderRadius: 50,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 5,
      borderColor: 'white',
      top: -20,
    },
  });

export default styles;