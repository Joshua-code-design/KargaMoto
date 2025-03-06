import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 40,
    },
    headerContainer: {
      width: "100%",
      paddingHorizontal: 20,
    },
    iconButtonsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 16,
    },
    profileContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      padding: 10,
      backgroundColor: "white",
      borderRadius: 10,
    },
    profileInfo: {
      marginLeft: 10,
    },
    profileName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    viewProfile: {
      fontSize: 14,
      color: "gray",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      width: "100%",
      gap: 16,
    },
    bigButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      padding: 16,
      flex: 1,
    },
    bigButtonText: {
      marginTop: 8,
      fontSize: 14,
      color: "black",
    },
    settingsContainer: {
      width: "90%",
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      marginTop: 20,
    },
    settingsTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
      color: "gray",
    },
    settingsOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
    },
    optionLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionText: {
      marginLeft: 8,
      fontSize: 16,
      color: "black",
    },
  });

export default styles;