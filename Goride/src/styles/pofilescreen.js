import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    coverContainer: {
      width: "100%",
      height: 100,
      backgroundColor: "#000",
    },
    profileContainer: {
      alignItems: "center",
      marginTop: -50,
    },
    profileIconContainer: {
      position: "relative",
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    editProfileIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: "#fff",
      padding: 5,
      borderRadius: 15,
      elevation: 3,
    },
    infoContainer: {
      marginTop: 20,
      paddingHorizontal: 20,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    label: {
      fontSize: 14,
      color: "#888",
      marginTop: 10,
    },
    value: {
      fontSize: 16,
      fontWeight: "500",
    },
    accountSetting: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 20,
      marginBottom: 10,
    },
  });

export default styles;